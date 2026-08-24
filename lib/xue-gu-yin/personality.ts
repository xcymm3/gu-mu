import type { GameState, PersonalityId, PersonalityRouteId, PersonalityScores } from "./model.ts";

export const personalityIds = ["power", "compassion", "insight", "scheme"] as const satisfies readonly PersonalityId[];

export const personalityRouteMap: Record<PersonalityId, PersonalityRouteId> = {
  power: "zhao",
  compassion: "ji",
  insight: "su",
  scheme: "traitor",
};

export function createPersonalityScores(): PersonalityScores {
  return { power: 0, compassion: 0, insight: 0, scheme: 0 };
}

export function addPersonalityScores(
  current: PersonalityScores,
  change: Partial<PersonalityScores> = {},
): PersonalityScores {
  return Object.fromEntries(
    personalityIds.map((personality) => [personality, current[personality] + (change[personality] ?? 0)]),
  ) as PersonalityScores;
}

export function rankPersonalities(scores: PersonalityScores): PersonalityId[] {
  return [...personalityIds].sort((left, right) => (
    scores[right] - scores[left]
    || personalityIds.indexOf(left) - personalityIds.indexOf(right)
  ));
}

export function resolveDominantPersonalities(scores: PersonalityScores): PersonalityId[] {
  const ranked = rankPersonalities(scores);
  const highest = scores[ranked[0]];
  return ranked.filter((personality) => scores[personality] === highest);
}

export function resolvePersonalityRoute(scores: PersonalityScores): PersonalityRouteId | null {
  const dominant = resolveDominantPersonalities(scores);
  return dominant.length === 1 ? personalityRouteMap[dominant[0]] : null;
}

export function lockPersonalityRoute(state: GameState, tieBreak?: PersonalityId): GameState {
  if (state.routeLocked) return state;
  const dominant = resolveDominantPersonalities(state.personality);
  const personality = tieBreak ?? (dominant.length === 1 ? dominant[0] : undefined);
  if (!personality || !dominant.includes(personality)) return state;
  return { ...state, route: personalityRouteMap[personality], routeLocked: true };
}
