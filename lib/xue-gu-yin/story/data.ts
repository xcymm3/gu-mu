import type { Ending, Role, RoleId, Scene } from "../model.ts";
import { chamberChoices, fogRouteChoices, gateChoices, illusionChoices, shadowChoices, swarmChoices } from "./common/choices.ts";
import { gateEvents } from "./events/act1.ts";
import { chamberEvents, fogEvents, illusionEvents, puppetsEvents, shadowEvents, swarmEvents } from "./events/act2.ts";
import { awakeningEvents, bloodGuardEvents, bloodRoomEvents, finaleEvents, masterBattleEvents, qiaoBattleEvents, zhaoBattleEvents } from "./events/act4.ts";
import { qiaoRevealEvents } from "./events/key-scenes.ts";
import { jiActThreeScenes } from "./routes/ji.ts";
import { suActThreeScenes } from "./routes/su.ts";
import { traitorActThreeScenes } from "./routes/traitor.ts";
import { zhaoActThreeScenes } from "./routes/zhao.ts";

export const storyMeta = {
  title: "血蛊引",
  subtitle: "夜雨蛊市 · 五人入墓",
  acts: [
    { act: 1, name: "聚", nodes: 1 },
    { act: 2, name: "入", nodes: 6 },
    { act: 3, name: "离", nodes: 4 },
    { act: 4, name: "血魔蛊室", nodes: 3 },
    { act: 5, name: "结局", nodes: "可变" },
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
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 1", title: "夜雨墓门",
    events: gateEvents,
    choices: gateChoices,
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 6", title: "甬道蛊潮",
    events: swarmEvents,

    choices: swarmChoices,
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 6", title: "血影示警",
    events: shadowEvents,

    choices: shadowChoices,
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 6", title: "机关暗室",
    events: chamberEvents,

    choices: chamberChoices,
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 6", title: "迷魂阵",
    events: illusionEvents,

    choices: illusionChoices,
  },
  puppets: {
    id: "puppets", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 6", title: "铜皮傀儡",
    events: puppetsEvents,

    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "fog", victoryFlag: "傀儡已毁", defeatFlag: "傀儡重伤" },
  },
  fog: {
    id: "fog", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 6", title: "大雾迷踪",
    events: fogEvents,

    choices: fogRouteChoices,
  },
  ...zhaoActThreeScenes,
  ...jiActThreeScenes,
  ...suActThreeScenes,
  ...traitorActThreeScenes,
  bloodGuard: {
    id: "bloodGuard", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "守门血傀儡",
    events: bloodGuardEvents,
    battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "bloodRoom", defeatNext: "bloodRoom", victoryFlag: "血傀儡已毁", defeatFlag: "血傀儡被赵黎击碎" },
  },
  bloodRoom: {
    id: "bloodRoom", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "五转蛊卵",
    events: bloodRoomEvents,
    choices: [{ id: "resist", label: "压住蛊种，寻找血祭阵眼", next: "awakening", result: "你压住翻涌的蛊种，在漫天血纹中寻找阵眼。" }, { id: "answer-qiao", label: "拖住乔无咎，逼他多说一句", next: "awakening", result: "你扬声拖住乔无咎，逼他多说了半句。他的声音里，第一次透出不耐。" }],
  },
  awakening: {
    id: "awakening", act: 4, node: 2, chapter: "第四幕 · 血魔蛊室 · 节点 2 / 3", title: "血流将醒",
    events: awakeningEvents,
    choices: [{ id: "face-final", label: "在蛊卵彻底裂开前作出选择", next: "finale", result: "你在蛊卵彻底裂开前，做出了选择。" }],
  },
  finale: {
    id: "finale", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "人吃蛊，还是蛊吃人",
    events: finaleEvents,
    choices: [
      { id: "duel-zhao", label: "以冰寒秘术压蛊，与赵黎决战", next: "zhaoBattle", result: "你以冰寒秘术压住血魔蛊，旧玉血光与赵黎的血线撞在一处。", requires: { route: "zhao", flags: ["冰寒蛊简"] } },
      { id: "break-array", label: "与纪清寒一同炸毁祭阵", next: "ending", result: "你与纪清寒一同引爆祭阵。血魔蛊在将醒未醒之间，化成了灰。", requires: { route: "ji" }, effect: { ending: "severed" } },
      { id: "feed-blood", label: "以身入池，与血魔蛊共生", next: "ending", result: "你纵身跃入血池，准备以全部血液与血魔蛊共生。", requires: { route: "su" }, effect: { ending: "sacrifice" } },
      { id: "fight-master", label: "唤众人联手，先斩复苏苏衍", next: "masterBattle", result: "你唤众人联手。五人第一次，真正站在了同一边。", requires: { route: "su", flags: ["苏莹存活"] } },
    ],
  },
  masterBattle: {
    id: "masterBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "苏衍诈死",
    events: masterBattleEvents,
    battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "ending", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食" },
  },
  zhaoBattle: {
    id: "zhaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "血蛊相争",
    events: zhaoBattleEvents,
    battle: { enemyName: "赵黎", enemyHealth: 22, victoryNext: "qiaoReveal", defeatNext: "ending", victoryFlag: "血魔蛊", defeatFlag: "赵黎夺蛊" },
  },
  qiaoReveal: {
    id: "qiaoReveal", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "执棋者现身",
    events: qiaoRevealEvents,
    choices: [
      { id: "fight-qiao", label: "迎上去，与乔无咎做个了断", next: "qiaoBattle", result: "你迎上去，攥紧掌心那抹猩红，与乔无咎做个了断。" },
    ],
  },
  qiaoBattle: {
    id: "qiaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "暗室杀局",
    events: qiaoBattleEvents,
    battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "ending", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "乔无咎得逞" },
  },
};

export const endings: Record<string, Ending> = {
  demon: { id: "demon", name: "夺蛊成魔", epitaph: "血浪吞人，唯你仍立。", text: "乔无咎现身的瞬间，你终于放开那点克制。血魔蛊脱手，六尺血幕吞了乔无咎，也吞了你最后的人性。墓门外月色如血，你成了再无人敢直呼其名的血蛊魔君。", background: "background.blood-ruin" },
  severed: { id: "severed", name: "破蛊断脉", epitaph: "蛊碎了，人还在。", text: "纪清寒冻结阵眼三息，你引爆蛊种，血魔蛊与血祭一同化灰。你们修为尽废，却互相搀扶走出天亮的墓门。江湖失去两名蛊修，山野多了一间安静药铺。", background: "background.dawn-exit" },
  sacrifice: { id: "sacrifice", name: "以身饲蛊", epitaph: "人蛊共生，意志为主。", text: "你以全身血液替代祭品，与血魔蛊共生。苏莹没有回来，但你让蛊听命于人。此后人间多了一位镇压邪蛊的血蛊主，每年入冬，你都会去她坟前坐一会儿。", background: "background.dawn-exit" },
  true: { id: "true", name: "血脉归位", epitaph: "五人出墓，天光未负。", text: "苏衍败亡，乔无咎化为枯骨，血室崩塌。赵黎留下未竟之战，薛逢发誓改邪，纪清寒将寒蚕丝系在你腕上；苏莹红着眼问你以后会不会丢下她。你说，不丢了。", background: "background.dawn-exit" },
  deathByZhao: { id: "deathByZhao", name: "血蛊反噬", epitaph: "血蛊相争，败者无坟。", text: "赵黎掌中血线穿透你的蛊种。旧玉落地，被他一脚踏碎。血魔蛊在池中发出一声低鸣——它已认主，却不是认你。", background: "background.blood-ruin" },
  deathByMaster: { id: "deathByMaster", name: "命丧墓主", epitaph: "五转之下，皆为祭品。", text: "苏衍的五转威压碾碎了你最后的蛊息。血池倒灌，你看见自己的血汇入那具黑石棺椁，成为它下一场沉睡的养分。", background: "background.blood-chamber" },
  death: { id: "death", name: "命丧血池", epitaph: "血魔蛊醒，先吞活人。", text: "你在蛊室中失去最后一点真元。血祭没有停下，苏衍与乔无咎的谋算都沉入血池，只剩血魔蛊记得你的气息。", background: "background.blood-ruin" },
  trapped: { id: "trapped", name: "困于蛊墓", epitaph: "迟疑太久，墓门已合。", text: "你们在机关与伤势中耗尽时间。血雾封死所有退路，墓门外的夜雨仍在下，却再也落不到你身上。", background: "background.fog-passage" },
  lone: { id: "lone", name: "独活出墓", epitaph: "蛊散，人独活。", text: "乔无咎倒下时，你看见血魔蛊在掌心跃跃欲试的猩红。你收了手，反手将它连同自己的蛊种一并震碎。同行之人死尽，你独自走出墓门，身后背着一座空墓，与再无人能作证的夜雨。", background: "background.dawn-exit" },
  traitor: { id: "traitor", name: "叛徒", epitaph: "为虎作伥，终被虎噬。", text: "你为虎作伥，助乔无咎杀尽同伴，却先被乔无咎弃子，再死于化魔的赵黎之手。连“背叛”都没能救你的命。", background: "background.control-room" },
};

const allEndingIds = Object.keys(endings);
export const endingAccess: Record<RoleId, string[]> = {
  healer: allEndingIds.filter((endingId) => endingId !== "true"),
  swordsman: [...allEndingIds],
  heir: [...allEndingIds],
};
