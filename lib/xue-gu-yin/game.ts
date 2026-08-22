import { resolveCombatTurn, type GuAction } from "./combat.ts";
import { resolveScenePresentation } from "./engine/narrative.ts";
import { endings, roles } from "./story/data.ts";
import type { AllyId, Battle, Choice, EnemyAction, GameState, RoleId, Scene } from "./model.ts";

export { endingAccess, endings, roles, scenes, storyMeta, storyPresentation } from "./story/data.ts";
export { resolveSceneBeats, resolveSceneEvents, resolveScenePresentation, type PresentedCharacter, type SceneBeat, type ScenePresentation } from "./engine/narrative.ts";
export type { GuAction } from "./combat.ts";
export type { AllyId, Battle, BattleConfig, CharacterId, CharacterPosition, Choice, Effect, Ending, EnemyAction, GameState, Role, RoleId, RouteId, Scene, VisualNovelEvent } from "./model.ts";

export function initialGame(): GameState { return { roleId: null, sceneId: "gate", route: null, health: 0, maxHealth: 0, essence: 0, maxEssence: 0, time: 0, flags: [], trust: { zhao: 0, ji: 0, xue: 0, su: 0, qiao: 0 }, battle: null, endingId: null }; }
export function getRole(id: RoleId | null) { return roles.find((role) => role.id === id) ?? null; }
export function chooseRole(id: RoleId = "healer") { const role = getRole(id)!; return { ...initialGame(), roleId: id, health: role.maxHealth, maxHealth: role.maxHealth, essence: role.maxEssence, maxEssence: role.maxEssence, flags: role.sense === "high" ? ["高神识"] : [] }; }

// 好感度并列顺序：赵黎 > 薛逢 > 纪清寒 > 苏莹
const allyOrder: AllyId[] = ["zhao", "xue", "ji", "su"];
export function rankTrust(trust: Record<AllyId, number>): AllyId[] {
  return [...allyOrder].sort((a, b) => (trust[b] - trust[a]) || (allyOrder.indexOf(a) - allyOrder.indexOf(b)));
}

export function canChoose(state: GameState, choice: Choice) {
  if (choice.requires?.route && state.route !== choice.requires.route) return false;
  if (choice.requires?.flags && !choice.requires.flags.every((flag) => state.flags.includes(flag))) return false;
  if (choice.requires?.allyTopTwo && !rankTrust(state.trust).slice(0, 2).includes(choice.requires.allyTopTwo)) return false;
  return true;
}
function unique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  const trust = { ...state.trust };
  for (const [ally, amount] of Object.entries(effect?.trust ?? {})) trust[ally as AllyId] += amount ?? 0;
  const maxHealth = Math.max(1, state.maxHealth + (effect?.maxHealth ?? 0));
  const maxEssence = Math.max(0, state.maxEssence + (effect?.maxEssence ?? 0));
  const flags = [...new Set([...state.flags, ...(effect?.flags ?? []), effect?.flag, effect?.ending ? `结局:${effect.ending}` : undefined].filter((f): f is string => Boolean(f)))];
  return { ...state, sceneId: choice.next, route: effect?.route ?? state.route, maxHealth, maxEssence, health: Math.max(1, Math.min(maxHealth, state.health + (effect?.health ?? 0))), essence: Math.max(0, Math.min(maxEssence, state.essence + (effect?.essence ?? 0))), time: state.time + (effect?.time ?? 0), flags, trust };
}
/** 若选项带 randomFlags，则随机取其一并入 effect.flags，并按结果生成对应 result 文本（供 UI 在选择时调用，保证 result 写明所得蛊）。 */
export function resolveRandomChoice(choice: Choice, roll: () => number = Math.random): Choice {
  const effect = choice.effect;
  if (!effect?.randomFlags?.length) return choice;
  const flag = effect.randomFlags[Math.min(effect.randomFlags.length - 1, Math.floor(roll() * effect.randomFlags.length))];
  const picked = "你收回手，侧过身，示意苏莹先挑。苏莹娇躯一震，眼中满是不可思议，半晌才微不可察地说了句“多谢”。她缓缓上前，纤细的指尖在五只蛊卵上逐一抚过，动作轻柔得如同抚摸旧友。最终，她停在最边缘一枚毫不起眼的黑斑蛊卵前，小心翼翼地将它收进怀中。";
  const result = flag === "血甲蛊"
    ? `${picked}剩下的蛊卵里，你顺理成章地伸出手，将那枚与你真元呼应、甲纹森森的蛊卵收入囊中，腰间的“甲衣蛊”微微震颤。苏莹抬头看你，轻声呢喃：“……多谢。”`
    : `${picked}剩下的蛊卵里，你顺理成章地伸出手，将那枚与你真元呼应、血芒吞吐的蛊卵收入囊中，囊中的“月光蛊”光芒顿暗。苏莹抬头看你，轻声呢喃：“……多谢。”`;
  return { ...choice, result, effect: { ...effect, flags: [...(effect.flags ?? []), flag] } };
}
/** @deprecated 新界面应读取 resolveScenePresentation；保留该门面以兼容旧调用。 */
export function sceneText(state: GameState, scene: Scene) { return resolveScenePresentation(state, scene).text; }
export function getEnemyCondition(health: number, maximum: number) { return health >= maximum ? "健康" : health <= maximum * 0.3 ? "重伤" : "受伤"; }

const patterns: Record<string, EnemyAction[]> = {
  "铜皮傀儡": [{ id: "pounce", damage: 2, cue: "铜皮傀儡周身齿轮嘎吱作响，庞大的躯干猛然一沉，周身活蛊线绷紧如弓弦，宛如一头被铁链死死锁住颈项的绝世凶兽，杀机毕露，正在蓄势待发。" }, { id: "wire", damage: 3, cue: "傀儡那冰冷硕大的铜拳裹挟着撕裂空气的剧烈破风声，带着万钧重压，轰然朝你当头砸来！" }, { id: "crush", damage: 5, cue: "傀儡双臂缓缓抬起，庞大的阴影如塌陷的泰山般沉甸甸压下，无形的劲力封锁了周遭数尺退路，逼得你必须全神贯注全力抵御。" }],
  "血傀儡": [{ id: "lash", damage: 4, cue: "血傀儡胸前的血光一亮，一条血色锁链破空抽来。" }, { id: "smash", damage: 6, cue: "血傀儡抬起磨盘大的拳头，带起一阵腥风，似要当头砸下。" }, { id: "roar", damage: 8, cue: "血傀儡胸腔里的血核剧烈鼓动，一圈血浪自它脚下炸开，直逼面门。" }],
  "苏衍": [{ id: "mist", damage: 4, cue: "苏衍抬手时，血池中升起一层沉重血雾，连呼吸都像被人攥住。" }, { id: "seal", damage: 6, cue: "黑石棺上的蛊印逐一亮起，整座墓室都在回应苏衍的心跳。" }, { id: "feast", damage: 9, cue: "苏衍张开五指，血池中的残魂齐齐尖啸，似要将所有活人的气血一口吞尽。" }, { id: "rest", damage: 0, heal: 5, cue: "苏衍闭目吸纳血池余烬，散开的威压正在重新凝实。" }, { id: "blooddemon", damage: 6, heal: 6, cue: "苏衍掌心的血魔蛊舒展开来，一线猩红吸走你的血气，反哺回他干瘪的躯壳。" }],
  "赵黎": [{ id: "thread", damage: 4, cue: "赵黎指尖垂下一缕血丝，细得几乎融入石室阴影。" }, { id: "palm", damage: 6, cue: "赵黎袖袍无风自鼓，掌前血气压得灯火偏向一侧。" }, { id: "mirror", damage: 0, invulnerable: true, reflect: true, cue: "赵黎身前浮起一层薄薄血幕，幕中倒映出你的身影，暗流正反向涌动。" }, { id: "thread2", damage: 4, cue: "赵黎的血丝再次垂落，这一次缠上了石缝里未熄的火星。" }, { id: "palm2", damage: 7, cue: "赵黎掌前血气压得更低，连你的呼吸都跟着一沉。" }, { id: "mirror2", damage: 0, invulnerable: true, reflect: true, cue: "血幕再起，你的倒影在幕中冷冷笑了一声。" }, { id: "thread3", damage: 4, cue: "赵黎的血丝已染红了半截衣袖，杀意凝如实质。" }, { id: "palm3", damage: 8, cue: "赵黎掌前血浪翻涌到极致，整座墓室的灯火齐齐一暗。" }, { id: "mirror3", damage: 0, invulnerable: true, reflect: true, cue: "血幕几乎吞没了你，幕中映出的身影正缓缓抬起与你相同的手。" }],
  "乔无咎": [{ id: "wire", damage: 3, essenceDrain: 1, cue: "乔无咎十指勾动，暗室里的活蛊线如蛛网般绷紧，数枚傀儡蛊核齐齐亮起。" }, { id: "puppets", damage: 6, essenceDrain: 1, cue: "乔无咎一声低笑，成排铜皮傀儡自石壁后转出，向你围拢而来。" }, { id: "trap", damage: 9, essenceDrain: 2, cue: "乔无咎猛地一拽，你脚下的石砖寸寸崩裂，脚下机关几乎要将你吞进去。" }],
};
function configFor(state: GameState, scene: Scene) { return typeof scene.battle === "function" ? scene.battle(state) : scene.battle; }
function patternFor(name: string) { return patterns[name] ?? patterns["铜皮傀儡"]; }
export function startBattle(state: GameState, scene: Scene): GameState {
  const config = configFor(state, scene); const role = getRole(state.roleId); if (!config || !role) return state;
  const pattern = patternFor(config.enemyName);
  const gift = config.enemyName === "铜皮傀儡" && state.flags.includes("苏莹低语") ? 4 : 0;
  const maxHealth = state.maxHealth + gift;
  const health = state.health + gift;
  return { ...state, maxHealth, health, essence: state.maxEssence, battle: { ...config, enemyMaxHealth: config.enemyHealth, turn: 0, intent: pattern[0] } };
}
function finishBattle(state: GameState, battle: Battle, won: boolean, health: number) {
  const next = won ? battle.victoryNext : battle.defeatNext;
  const flag = won ? battle.victoryFlag : battle.defeatFlag;
  const final = battle.enemyName === "苏衍" ? (won ? "true" : "deathByMaster")
    : battle.enemyName === "赵黎" ? (won ? undefined : "deathByZhao")
    : battle.enemyName === "乔无咎" ? (won ? (state.flags.includes("血魔蛊已用") ? "demon" : "lone") : "death")
    : undefined;
  const maxEssence = battle.enemyName === "血傀儡" && won ? state.maxEssence + 4 : state.maxEssence;
  const essence = battle.enemyName === "血傀儡" && won ? Math.min(maxEssence, state.essence + 4) : state.essence;
  return { ...state, maxEssence, essence, health: won ? Math.min(state.maxHealth, Math.max(1, health) + 2) : 1, time: won ? state.time : state.time + 1, sceneId: next, battle: null, flags: unique(unique(state.flags, flag), final ? `结局:${final}` : undefined) };
}
export function resolveBattleTurn(state: GameState, action: GuAction): GameState {
  const battle = state.battle; const role = getRole(state.roleId); if (!battle || !role) return state;
  const result = resolveCombatTurn({
    action,
    roleId: role.id,
    attack: role.attack,
    health: state.health,
    maxHealth: state.maxHealth,
    essence: state.essence,
    maxEssence: state.maxEssence,
    hasBloodBlade: state.flags.includes("血刃蛊"),
    hasBloodArmor: state.flags.includes("血甲蛊"),
    hasBloodDemon: state.flags.includes("血魔蛊"),
    enemyHealth: battle.enemyHealth,
    enemyMaxHealth: battle.enemyMaxHealth,
    turn: battle.turn,
    intent: battle.intent,
  });
  if (!result.valid) return state;

  const flags = action === "blooddemon" ? unique(state.flags, "血魔蛊已用") : state.flags;
  if (result.status === "won") return finishBattle({ ...state, essence: result.essence, flags }, battle, true, result.health);
  if (result.status === "lost") return finishBattle({ ...state, essence: result.essence, flags }, battle, false, result.health);

  const pattern = patternFor(battle.enemyName);
  return {
    ...state,
    health: result.health,
    essence: result.essence,
    flags,
    battle: {
      ...battle,
      enemyHealth: result.enemyHealth,
      turn: result.turn,
      intent: pattern[result.turn % pattern.length],
    },
  };
}
export function resolveEnding(state: GameState) {
  const explicit = state.flags.find((flag) => flag.startsWith("结局:"))?.slice(3);
  if (explicit && explicit in endings) return explicit;
  if (state.time >= 4) return "trapped";
  return "lone";
}
