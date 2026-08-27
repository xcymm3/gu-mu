import { resolveCombatTurn, type GuAction } from "./combat.ts";
import { resolveScenePresentation } from "./engine/narrative.ts";
import { addPersonalityScores, createPersonalityScores, resolveDominantPersonalities } from "./personality.ts";
import { endings, roles } from "./story/data.ts";
import type { Battle, Choice, EnemyAction, GameState, RoleId, Scene } from "./model.ts";

export { endingAccess, endings, roles, scenes, storyMeta, storyPresentation } from "./story/data.ts";
export { resolveSceneBeats, resolveSceneEvents, resolveScenePresentation, type PresentedCharacter, type SceneBeat, type ScenePresentation } from "./engine/narrative.ts";
export { createPersonalityScores, lockPersonalityRoute, personalityIds, personalityRouteMap, rankPersonalities, resolveDominantPersonalities, resolvePersonalityRoute } from "./personality.ts";
export type { GuAction } from "./combat.ts";
export type { Battle, BattleConfig, CharacterId, CharacterPosition, Choice, Effect, Ending, EnemyAction, GameState, PersonalityId, PersonalityRouteId, PersonalityScores, Role, RoleId, RouteId, Scene, VisualNovelEvent } from "./model.ts";

export function initialGame(): GameState { return { roleId: null, sceneId: "gate", route: null, routeLocked: false, personality: createPersonalityScores(), health: 0, maxHealth: 0, essence: 0, maxEssence: 0, time: 0, flags: [], battle: null, endingId: null }; }
export function getRole(id: RoleId | null) { return roles.find((role) => role.id === id) ?? null; }
export function chooseRole(id: RoleId = "healer") { const role = getRole(id)!; return { ...initialGame(), roleId: id, health: role.maxHealth, maxHealth: role.maxHealth, essence: role.maxEssence, maxEssence: role.maxEssence, flags: role.sense === "high" ? ["高神识"] : [] }; }

export function canChoose(state: GameState, choice: Choice) {
  if (choice.requires?.route && state.route !== choice.requires.route) return false;
  if (choice.requires?.flags && !choice.requires.flags.every((flag) => state.flags.includes(flag))) return false;
  if (choice.requires?.dominantPersonality && !resolveDominantPersonalities(state.personality).includes(choice.requires.dominantPersonality)) return false;
  return true;
}
function unique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  const personality = state.routeLocked
    ? state.personality
    : addPersonalityScores(state.personality, effect?.personality);
  const maxHealth = Math.max(1, state.maxHealth + (effect?.maxHealth ?? 0));
  const maxEssence = Math.max(0, state.maxEssence + (effect?.maxEssence ?? 0));
  const flags = [...new Set([...state.flags, ...(effect?.flags ?? []), effect?.flag, effect?.ending ? `结局:${effect.ending}` : undefined].filter((f): f is string => Boolean(f)))];
  const requestedRoute = effect?.route;
  const route = state.routeLocked ? state.route : requestedRoute ?? state.route;
  const routeLocked = state.routeLocked || requestedRoute !== undefined;
  return { ...state, sceneId: choice.next, route, routeLocked, personality, maxHealth, maxEssence, health: Math.max(1, Math.min(maxHealth, state.health + (effect?.health ?? 0))), essence: Math.max(0, Math.min(maxEssence, state.essence + (effect?.essence ?? 0))), time: state.time + (effect?.time ?? 0), flags };
}
/** 若选项带 randomFlags，则随机取其一并入 effect.flags，并按结果生成对应 result 文本（供 UI 在选择时调用，保证 result 写明所得蛊）。 */
export function resolveRandomChoice(choice: Choice, roll: () => number = Math.random): Choice {
  const effect = choice.effect;
  if (!effect?.randomFlags?.length) return choice;
  const flag = effect.randomFlags[Math.min(effect.randomFlags.length - 1, Math.floor(roll() * effect.randomFlags.length))];
  const picked = "你收回探向石龛的手，侧身给苏莹让出位置。\n\n苏莹微微一怔，抬头看了你一眼。见你没有改变主意，她才走到那枚黑斑蛊卵前。\n\n她并未贸然注入真元，而是伸出手指，沿着石龛边缘的残缺阵纹依次轻触。几息之后，苏莹低声念出数个晦涩音节。黑斑蛊卵内部原本杂乱的摩擦声逐渐平息，卵壳上的斑纹也随之收缩。\n\n苏莹小心地将蛊卵收入怀中。\n\n你记下了她触碰阵纹的顺序，也终于看出石龛中的蛊卵并非自行选择主人。真正产生反应的，是石龛下方尚未完全失效的残阵。它会根据靠近者的气息，唤醒其能够承受的蛊卵。\n\n黑斑蛊卵离开石龛后，残阵顿时变得极不稳定。所剩药力已不足以同时维持另外两枚蛊卵，甲纹与血纹之间只能有一枚继续保持生机。\n\n";
  const result = flag === "血甲蛊"
    ? `${picked}血纹蛊卵表面的暗红光芒迅速熄灭，甲纹蛊卵却仍在轻轻震动。\n\n你赶在残阵彻底消散前将其取出。卵壳沿着甲纹裂开，一只背甲暗红的血甲蛊从碎壳中爬出，顺着你的手臂进入蛊囊。\n\n苏莹收好黑斑蛊卵，低声向你道了一句谢。`
    : `${picked}甲纹蛊卵很快变得灰暗，血纹蛊卵内部却传出一声清晰的裂响。\n\n你抬手将其接住。一只薄翼如刃的血色蛊虫破壳而出，在昏暗的火光下绕行一周，随后落入你的蛊囊。\n\n苏莹收好黑斑蛊卵，低声向你道了一句谢。`;
  return { ...choice, result, effect: { ...effect, flags: [...(effect.flags ?? []), flag] } };
}
/** @deprecated 新界面应读取 resolveScenePresentation；保留该门面以兼容旧调用。 */
export function sceneText(state: GameState, scene: Scene) { return resolveScenePresentation(state, scene).text; }
export function getEnemyCondition(health: number, maximum: number) { return health >= maximum ? "健康" : health <= maximum * 0.3 ? "重伤" : "受伤"; }

const patterns: Record<string, EnemyAction[]> = {
  "铜皮傀儡": [{ id: "pounce", damage: 2, cue: "铜皮傀儡周身齿轮嘎吱作响，躯干猛地一沉，背后的牵机丝随之绷紧。" }, { id: "wire", damage: 3, cue: "傀儡的铜拳带起尖锐风声，直奔你的面门。" }, { id: "crush", damage: 5, cue: "傀儡缓缓抬起双臂，沉重阴影压住了周围的退路。" }],
  "血傀儡": [{ id: "lash", damage: 4, cue: "血傀儡胸腔的血核亮起，缠在左腕的锁链随之绷直，贴着石面横扫而来。" }, { id: "smash", damage: 6, cue: "血傀儡右臂缓缓抬起，粗大的拳头越过头顶，正对着你站立之处砸下。" }, { id: "roar", damage: 8, cue: "血傀儡胸腔里的血核连续鼓动，阵槽中的暗红血水被牵引到它脚边，正在向外聚成一圈血浪。" }],
  "苏衍": [{ id: "mist", damage: 4, cue: "苏衍抬起右手，窄井中升起一层沉重血雾，正沿石面压向你所在的位置。" }, { id: "seal", damage: 6, cue: "黑石棺上的旧印逐一亮起，两道暗红阵光从左右向你收拢。" }, { id: "feast", damage: 9, cue: "苏衍张开五指，石殿各处导血槽同时逆流，正牵引你体内的气血向棺前汇聚。" }, { id: "rest", damage: 0, heal: 5, cue: "苏衍闭目按住棺沿，从窄井残线中抽取血气，干瘪四肢正在重新充实。" }, { id: "blooddemon", damage: 6, heal: 6, cue: "石殿中央的暗红蛊茧裂开，血魔蛊沿新凿阵线落入苏衍掌心，细长口器已经转向你的气血。" }],
  "赵黎": [{ id: "thread", damage: 4, cue: "赵黎指尖微勾，一缕细血丝贴着池沿游来，几乎融进地面的暗红反光。" }, { id: "palm", damage: 6, cue: "赵黎收回血丝，右掌前的血气层层聚拢，压得近处灯火偏向一侧。" }, { id: "mirror", damage: 0, invulnerable: true, reflect: true, cue: "赵黎没有追击，反而将血纹蛊召回身前。薄薄血幕随之展开，幕中你的倒影正把蛊息引向来处。" }, { id: "thread2", damage: 4, cue: "赵黎换过指诀，细血丝从两块碎石之间分岔绕行，分别逼向你的手腕与脚踝。" }, { id: "palm2", damage: 7, cue: "赵黎掌前血气比先前更凝实了一层。他踏过池沿碎石，掌势尚未推出，腥风已经压到面前。" }, { id: "mirror2", damage: 0, invulnerable: true, reflect: true, cue: "血纹蛊伏在赵黎掌心，第二重血幕缓缓合拢。幕内真元逆行，正等外力触及后原路送回。" }, { id: "thread3", damage: 4, cue: "赵黎染红的指尖轻轻一抖，三缕细血丝借着满地血痕交错游动，封住了左右闪避之处。" }, { id: "palm3", damage: 8, cue: "赵黎将余下真元尽数压向右掌，血气在掌前翻涌成浪，所过之处连池水都向两旁退开。" }, { id: "mirror3", damage: 0, invulnerable: true, reflect: true, cue: "最后一重血幕遮住赵黎全身。幕中的倒影与你动作相同，周围血气却在沿相反方向急速回卷。" }],
  "乔无咎": [{ id: "wire", damage: 3, essenceDrain: 1, cue: "乔无咎十指扣住牵机丝，细线随即从石梁间交错压下。线身尚未近身，蛊窍中的真元已经受到牵引。" }, { id: "puppets", damage: 6, essenceDrain: 1, cue: "乔无咎拍下右侧阵枢，两扇侧门同时转开。两具铜皮傀儡循着背后绷直的主线，从左右逼向石台中央。" }, { id: "trap", damage: 9, essenceDrain: 2, cue: "乔无咎压下中央扳杆。你周围的墓砖沿接缝向下沉去，梁间牵机丝也朝同一处收束。" }],
};
function configFor(state: GameState, scene: Scene) { return typeof scene.battle === "function" ? scene.battle(state) : scene.battle; }
function patternFor(name: string) { return patterns[name] ?? patterns["铜皮傀儡"]; }
export function startBattle(state: GameState, scene: Scene): GameState {
  const config = configFor(state, scene); const role = getRole(state.roleId); if (!config || !role) return state;
  const pattern = patternFor(config.enemyName);
  const gift = config.enemyName === "铜皮傀儡" && state.flags.includes("纪清寒回护") ? 4 : 0;
  const maxHealth = state.maxHealth + gift;
  return { ...state, maxHealth, essence: state.maxEssence, battle: { ...config, enemyMaxHealth: config.enemyHealth, turn: 0, intent: pattern[0] } };
}
function finishBattle(state: GameState, battle: Battle, won: boolean) {
  const next = won ? battle.victoryNext : battle.defeatNext;
  const flag = won ? battle.victoryFlag : battle.defeatFlag;
  const final = won ? battle.victoryEnding : battle.defeatEnding;
  const maxEssence = battle.enemyName === "血傀儡" && won ? state.maxEssence + 4 : state.maxEssence;
  const essence = battle.enemyName === "血傀儡" && won ? Math.min(maxEssence, state.essence + 4) : state.essence;
  return { ...state, maxEssence, essence, health: state.maxHealth, time: won ? state.time : state.time + 1, sceneId: next, battle: null, flags: unique(unique(state.flags, flag), final ? `结局:${final}` : undefined) };
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
  if (result.status === "won") return finishBattle({ ...state, essence: result.essence, flags }, battle, true);
  if (result.status === "lost") return finishBattle({ ...state, essence: result.essence, flags }, battle, false);

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
  return "trapped";
}
