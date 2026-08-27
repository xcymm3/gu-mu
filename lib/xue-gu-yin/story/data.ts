import type { Ending, Role, RoleId, Scene } from "../model.ts";
import { bloodThresholdChoices, chamberChoices, fogRouteChoices, gateChoices, illusionChoices, rainMarkChoices, shadowChoices, stoneBridgeChoices, swarmChoices } from "./common/choices.ts";
import { bloodThresholdEvents, gateEvents, rainMarkEvents } from "./events/act1.ts";
import { chamberEvents, fogEvents, illusionEvents, puppetsEvents, shadowEvents, stoneBridgeEvents, swarmEvents } from "./events/act2.ts";
import { jiRouteScenes } from "./routes/ji.ts";
import { suRouteScenes } from "./routes/su.ts";
import { traitorRouteScenes } from "./routes/traitor.ts";
import { zhaoRouteScenes } from "./routes/zhao.ts";

export const storyMeta = {
  title: "血蛊引",
  subtitle: "夜雨蛊市 · 五人入墓",
  acts: [
    { act: 1, name: "聚", nodes: 3 },
    { act: 2, name: "入", nodes: 7 },
    { act: 3, name: "离", nodes: "每线 4" },
    { act: 4, name: "决", nodes: "每线 6" },
    { act: 5, name: "归", nodes: "每线 2" },
  ],
} as const;

export const storyPresentation = {
  names: ["赵黎", "纪清寒", "薛逢", "苏莹", "乔无咎", "苏衍"],
  criticalTerms: ["血魔蛊", "五转", "血祭", "祖传旧玉", "月光蛊", "血刃蛊", "血甲蛊"],
};

export const roles: Role[] = [
  { id: "healer", name: "游方蛊医", gender: "male", title: "四转巅峰 · 游方蛊医", description: "居无定所的流浪蛊医，擅长回春之术。", maxHealth: 14, maxEssence: 12, attack: 3, signatureGu: "回春蛊", sense: "normal" },
  { id: "swordsman", name: "流浪剑修", gender: "male", title: "四转巅峰 · 流浪剑修", description: "以蛊御剑，不善言辞，只求用剑法斩尽一切。", maxHealth: 15, maxEssence: 10, attack: 4, signatureGu: "剑鸣蛊", sense: "normal" },
  { id: "heir", name: "世家之子", gender: "male", title: "四转巅峰 · 世家之子", description: "曾有过显赫世家，如今却穷困潦倒。神识过人，能看清人心。", maxHealth: 12, maxEssence: 10, attack: 3, signatureGu: "惑心蛊", sense: "high" },
];

export const scenes: Record<string, Scene> = {
  gate: {
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 3", title: "夜雨墓门",
    events: gateEvents,
    choices: gateChoices,
  },
  rainMark: {
    id: "rainMark", act: 1, node: 2, chapter: "第一幕 · 聚 · 节点 2 / 3", title: "雨洗蛊纹",
    events: rainMarkEvents,
    choices: rainMarkChoices,
  },
  bloodThreshold: {
    id: "bloodThreshold", act: 1, node: 3, chapter: "第一幕 · 聚 · 节点 3 / 3", title: "血门将合",
    events: bloodThresholdEvents,
    choices: bloodThresholdChoices,
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 7", title: "甬道蛊潮",
    events: swarmEvents,

    choices: swarmChoices,
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 7", title: "血影示警",
    events: shadowEvents,

    choices: shadowChoices,
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 7", title: "机关暗室",
    events: chamberEvents,

    choices: chamberChoices,
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 7", title: "迷魂阵",
    events: illusionEvents,

    choices: illusionChoices,
  },
  stoneBridge: {
    id: "stoneBridge", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 7", title: "断梁墓沟",
    events: stoneBridgeEvents,
    choices: stoneBridgeChoices,
  },
  puppets: {
    id: "puppets", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 7", title: "铜皮傀儡",
    events: puppetsEvents,

    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "ending", victoryFlag: "傀儡已毁", defeatFlag: "死于铜皮傀儡", defeatEnding: "deathByBloodGuard" },
  },
  fog: {
    id: "fog", act: 2, node: 7, chapter: "第二幕 · 入 · 节点 7 / 7", title: "大雾迷踪",
    events: fogEvents,

    choices: fogRouteChoices,
  },
  ...zhaoRouteScenes,
  ...jiRouteScenes,
  ...suRouteScenes,
  ...traitorRouteScenes,
};

export const endings: Record<string, Ending> = {
  demon: { id: "demon", name: "夺蛊成魔", epitaph: "血浪吞人，唯你仍立。", text: "乔无咎现身的瞬间，你终于放开那点克制。血魔蛊脱手，六尺血幕吞了乔无咎，也吞了你最后的人性。墓门外月色如血，你成了再无人敢直呼其名的血蛊魔君。", background: "background.blood-ruin" },
  severed: { id: "severed", name: "断脉相守", epitaph: "舍去修为，仍把归路走完。", text: "你与纪清寒同时逆转本命蛊息，将血魔蛊与血祭阵一同毁去，也带着血池边的三名同伴走出墓门。你们赶在魂丝熄灭前回到山中，陪那位至亲度过最后的日子。多年以后，旧屋前间改作药铺，半截残剑用来切药根；每天清晨，你们一起把门打开。", background: "background.dawn-exit" },
  true: { id: "true", name: "血脉归位", epitaph: "五人出墓，天光未负。", text: "苏衍败亡，乔无咎化为枯骨，血室崩塌。赵黎留下未竟之战，薛逢发誓改邪，纪清寒将寒蚕丝系在你腕上；苏莹红着眼问你以后会不会丢下她。你说，不丢了。", background: "background.dawn-exit" },
  deathByZhao: { id: "deathByZhao", name: "血蛊反噬", epitaph: "血蛊相争，败者无坟。", text: "赵黎掌中血线穿透你的蛊种。旧玉落地，被他一脚踏碎。血魔蛊在池中发出一声低鸣——它已认主，却不是认你。", background: "background.blood-ruin" },
  deathByMaster: { id: "deathByMaster", name: "命丧墓主", epitaph: "祖阵复明，来者皆成血食。", text: "你的气血填入窄井后，返生阵重新闭合。苏衍的呼吸逐渐有力，黑石棺上的旧印也一枚枚复明；你留在导血槽中的最后一线血色，成了他补全五转之身的养分。", background: "background.blood-chamber" },
  deathByQiao: { id: "deathByQiao", name: "命丧执棋者", epitaph: "机关尽出，牵丝锁魂。", text: "乔无咎发动整座蛊墓的机关。你避开了第一重埋伏，却最终被无数傀儡拖入血池，成为他自以为能够掌控的最后一份血食。", background: "background.control-room" },
  deathByBloodGuard: { id: "deathByBloodGuard", name: "命丧守墓傀儡", epitaph: "未见五转蛊，先成池中血。", text: "守墓傀儡的重拳砸碎了你最后的防御。墓道深处的五转蛊仍在跳动，而你的气血已经沿祭纹汇入它尚未睁开的复眼。", background: "background.blood-chamber" },
  trapped: { id: "trapped", name: "困于蛊墓", epitaph: "迟疑太久，墓门已合。", text: "你们在机关与伤势中耗尽时间。血雾封死所有退路，墓门外的夜雨仍在下，却再也落不到你身上。", background: "background.fog-passage" },
  traitor: { id: "traitor", name: "叛徒", epitaph: "为虎作伥，终被虎噬。", text: "你为虎作伥，助乔无咎杀尽同伴，却先被乔无咎弃子，再死于化魔的赵黎之手。连“背叛”都没能救你的命。", background: "background.control-room" },
};

const allEndingIds = Object.keys(endings);
export const endingAccess: Record<RoleId, string[]> = {
  healer: allEndingIds.filter((endingId) => endingId !== "true"),
  swordsman: [...allEndingIds],
  heir: [...allEndingIds],
};
