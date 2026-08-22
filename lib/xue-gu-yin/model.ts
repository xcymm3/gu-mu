import type { BackgroundAssetKey, CharacterAssetKey, VisualAssetKey } from "./assets.ts";

export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "zhao" | "ji" | "xue" | "su" | "qiao";
export type RouteId = "zhao" | "ji" | "xue" | "su";
export type CharacterId = "zhao-li" | "ji-qinghan" | "xue-feng" | "su-ying" | "qiao-wujiu" | "su-yan";
export type CharacterPosition = "far-left" | "left" | "center" | "right" | "far-right";

export type EnemyAction = {
  id: string;
  damage: number;
  cue: string;
  heal?: number;
  invulnerable?: boolean;
  reflect?: boolean;
  essenceDrain?: number;
};

export type Role = {
  id: RoleId;
  name: string;
  gender: "male";
  title: string;
  description: string;
  maxHealth: number;
  maxEssence: number;
  attack: number;
  signatureGu: string;
  sense: "high" | "normal";
};

export type Effect = {
  health?: number;
  maxHealth?: number;
  essence?: number;
  maxEssence?: number;
  time?: number;
  flag?: string;
  flags?: string[];
  ending?: string;
  trust?: Partial<Record<AllyId, number>>;
  route?: RouteId;
  randomFlags?: string[];
};

export type Choice = {
  id: string;
  label: string;
  next: string;
  result?: string;
  requires?: { route?: RouteId; flags?: string[]; allyTopTwo?: AllyId };
  effect?: Effect;
};

export type BattleConfig = {
  enemyName: string;
  enemyHealth: number;
  victoryNext: string;
  defeatNext: string;
  victoryFlag?: string;
  defeatFlag?: string;
};

export type Battle = BattleConfig & {
  enemyMaxHealth: number;
  turn: number;
  intent: EnemyAction;
};

export type GameState = {
  roleId: RoleId | null;
  sceneId: string;
  route: RouteId | null;
  health: number;
  maxHealth: number;
  essence: number;
  maxEssence: number;
  time: number;
  flags: string[];
  trust: Record<AllyId, number>;
  battle: Battle | null;
  endingId: string | null;
};

export type VisualNovelEvent =
  | { type: "background"; asset: BackgroundAssetKey; transition?: "cut" | "fade" }
  | { type: "character"; action: "show" | "hide" | "expression"; character: CharacterId; asset?: CharacterAssetKey; position?: CharacterPosition; expression?: string }
  | { type: "narration"; text: string; mode?: "dialogue-box" | "center" }
  | { type: "dialogue"; speaker: CharacterId; displayName: string; text: string; expression?: string; position?: CharacterPosition }
  | { type: "choice"; choices: Choice[] }
  | { type: "battle"; config: BattleConfig }
  | { type: "music"; action: "play" | "stop" | "keep"; asset?: VisualAssetKey; fadeMs?: number }
  | { type: "sound"; asset: VisualAssetKey }
  | { type: "effect"; effect: "fade" | "flash" | "shake" | "darken"; tone?: "neutral" | "danger" }
  | { type: "jump"; sceneId: string };

export type Scene = {
  id: string;
  act: 1 | 2 | 3 | 4;
  node: number;
  chapter: string;
  title: string;
  /** 旧版正文入口；迁移期间由叙事适配器转换为 narration 事件。 */
  text?: string | ((state: GameState) => string);
  /** 新版原生视觉小说事件；后续节点可逐段迁移，不要求一次改完。 */
  events?: VisualNovelEvent[] | ((state: GameState) => VisualNovelEvent[]);
  choices?: Choice[];
  battle?: BattleConfig | ((state: GameState) => BattleConfig);
};

export type Ending = { id: string; name: string; epitaph: string; text: string };
