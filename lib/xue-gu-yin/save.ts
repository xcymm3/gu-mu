import type { GameState } from "./model.ts";
import type { ReadingAnchor } from "./pagination.ts";

export const SAVE_SLOT_VERSION = 6 as const;
export const SAVE_SLOT_COUNT = 6;

export type NarrativePosition = { sceneId: string; page: number; anchor?: ReadingAnchor };
export type SaveSlot = {
  version: typeof SAVE_SLOT_VERSION;
  savedAt: string;
  game: GameState;
  narrative: NarrativePosition;
};
export type SaveSlots = Array<SaveSlot | null>;

const roleIds = new Set<GameState["roleId"]>(["healer", "swordsman", "heir", null]);
const routeIds = new Set<GameState["route"]>(["zhao", "ji", "su", "traitor", null]);
const personalityIds = ["power", "compassion", "insight", "scheme"] as const;

function isNarrativePosition(value: unknown): value is NarrativePosition {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NarrativePosition>;
  return typeof candidate.sceneId === "string"
    && Number.isInteger(candidate.page)
    && (candidate.page ?? -1) >= 0
    && (candidate.anchor === undefined || (candidate.anchor !== null
      && Number.isInteger(candidate.anchor.beatIndex) && candidate.anchor.beatIndex >= 0
      && Number.isInteger(candidate.anchor.offset) && candidate.anchor.offset >= 0));
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GameState>;
  return roleIds.has(candidate.roleId as GameState["roleId"])
    && typeof candidate.sceneId === "string"
    && routeIds.has(candidate.route as GameState["route"])
    && typeof candidate.routeLocked === "boolean"
    && Boolean(candidate.personality && typeof candidate.personality === "object")
    && personalityIds.every((personality) => Number.isFinite(candidate.personality?.[personality]))
    && Number.isFinite(candidate.health)
    && Number.isFinite(candidate.maxHealth)
    && Number.isFinite(candidate.essence)
    && Number.isFinite(candidate.maxEssence)
    && Array.isArray(candidate.flags);
}

export function emptySaveSlots(count = SAVE_SLOT_COUNT): SaveSlots {
  return Array.from({ length: count }, () => null);
}

export function isSaveSlot(value: unknown): value is SaveSlot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SaveSlot>;
  return candidate.version === SAVE_SLOT_VERSION
    && typeof candidate.savedAt === "string"
    && !Number.isNaN(Date.parse(candidate.savedAt))
    && isGameState(candidate.game)
    && isNarrativePosition(candidate.narrative);
}

export function normalizeSaveSlots(value: unknown, count = SAVE_SLOT_COUNT): SaveSlots {
  if (!Array.isArray(value)) return emptySaveSlots(count);
  return Array.from({ length: count }, (_, index) => isSaveSlot(value[index]) ? value[index] : null);
}

export function createSaveSlot({
  game,
  narrative,
  pendingGame,
  now = new Date(),
}: {
  game: GameState;
  narrative: NarrativePosition;
  pendingGame?: GameState | null;
  now?: Date;
}): SaveSlot {
  const stateToSave = pendingGame ?? game;
  return {
    version: SAVE_SLOT_VERSION,
    savedAt: now.toISOString(),
    game: stateToSave,
    narrative: stateToSave.sceneId === game.sceneId
      ? narrative
      : { sceneId: stateToSave.sceneId, page: 0 },
  };
}

export function restoreSaveSlot(slot: SaveSlot): { game: GameState; narrative: NarrativePosition } {
  const game = { ...slot.game, battle: slot.game.battle ?? null, endingId: null };
  const narrative = slot.narrative.sceneId === game.sceneId
    ? { ...slot.narrative }
    : { sceneId: game.sceneId, page: 0 };
  return { game, narrative };
}
