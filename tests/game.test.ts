import assert from "node:assert/strict";
import test from "node:test";

import {
  applyChoice,
  canChoose,
  chooseRole,
  getEnemyCondition,
  resolveBattleTurn,
  resolveEnding,
  scenes,
  startBattle,
} from "../lib/gu-tomb/game.ts";

test("敌方血量以隐性伤势状态呈现", () => {
  assert.equal(getEnemyCondition(10, 10), "健康");
  assert.equal(getEnemyCondition(8, 10), "受伤");
  assert.equal(getEnemyCondition(3, 10), "重伤");
});

test("角色属性决定剧情选项是否可用", () => {
  const inspectDoor = scenes.entrance.choices?.[0];
  assert.ok(inspectDoor);
  assert.equal(canChoose(chooseRole("healer"), inspectDoor), true);
  assert.equal(canChoose(chooseRole("swordsman"), inspectDoor), false);
});

test("选择会保留线索与关系后果", () => {
  const protectShen = scenes.bloodDoor.choices?.[1];
  assert.ok(protectShen);
  const result = applyChoice(chooseRole("healer"), protectShen);
  assert.equal(result.sceneId, "corpseFight");
  assert.equal(result.trust.shen, 1);
});

test("蛊斗战败转为重伤与时间代价", () => {
  const initial = { ...chooseRole("healer"), health: 2 };
  const battle = startBattle(initial, scenes.corpseFight);
  const result = resolveBattleTurn(battle, "blood");
  assert.equal(result.sceneId, "shenCare");
  assert.equal(result.health, 1);
  assert.equal(result.time, 1);
  assert.equal(result.flags.includes("重伤"), true);
});

test("关键线索与信任能触发两人出墓", () => {
  const state = { ...chooseRole("healer"), clues: ["五人血印"], trust: { qiao: 0, shen: 2, zhao: 0, jia: 0 } };
  assert.equal(resolveEnding(state), "together");
  assert.equal(resolveEnding({ ...state, time: 4 }), "trapped");
});

test("赵黎夺走血流蛊时，玩家命丧蛊墓", () => {
  const state = { ...chooseRole("healer"), flags: ["赵黎夺走血流蛊"], time: 9 };
  assert.equal(resolveEnding(state), "death");
});

test("血流蛊替换血刃蛊后造成六点伤害并恢复六点生命", () => {
  const state = { ...chooseRole("healer"), health: 2, flags: ["血流蛊已得"] };
  const battle = startBattle(state, scenes.qiaoDuel);
  const result = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 6 } }, "bloodflow");
  assert.equal(result.sceneId, "bloodExit");
  assert.equal(result.health, 8);
  assert.equal(result.essence, 11);
  assert.equal(result.flags.includes("乔无咎已诛"), true);
});

test("每场蛊斗均以角色的满真元开始", () => {
  const swordsman = { ...chooseRole("swordsman"), essence: 1 };
  const battle = startBattle(swordsman, scenes.corpseFight);
  assert.equal(battle.essence, 15);
  assert.equal(startBattle(chooseRole("healer"), scenes.corpseFight).essence, 12);
});

test("真元耗尽后只能调息并恢复三点", () => {
  const state = { ...chooseRole("healer"), essence: 0 };
  const battle = startBattle(state, scenes.corpseFight);
  const exhausted = { ...battle, essence: 0 };
  assert.equal(resolveBattleTurn(exhausted, "blood"), exhausted);
  const rested = resolveBattleTurn(exhausted, "rest");
  assert.equal(rested.essence, 3);
  assert.equal(rested.health, 7);
});

test("剑鸣蛊首回合斩杀尸灯傀儡时不会承受反击", () => {
  const battle = startBattle(chooseRole("swordsman"), scenes.corpseFight);
  const result = resolveBattleTurn(battle, "sword");
  assert.equal(result.sceneId, "corpseAftermath");
  assert.equal(result.health, 12);
  assert.equal(result.essence, 12);
});

test("回春蛊先恢复七点生命，再承受本回合攻击", () => {
  const battle = startBattle({ ...chooseRole("healer"), health: 2 }, scenes.corpseFight);
  const result = resolveBattleTurn(battle, "heal");
  assert.equal(result.health, 6);
  assert.equal(result.essence, 9);
});

test("血甲蛊在本回合完全免疫敌方伤害", () => {
  const battle = startBattle({ ...chooseRole("healer"), flags: ["血甲蛊已得"] }, scenes.corpseFight);
  const result = resolveBattleTurn(battle, "armor");
  assert.equal(result.health, 10);
  assert.equal(result.essence, 10);
});

test("尸灯傀儡战后先进入青萝关心的疗伤节点", () => {
  const battle = startBattle(chooseRole("swordsman"), scenes.corpseFight);
  const result = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 1 } }, "blood");
  assert.equal(result.sceneId, "shenCare");
  const medicine = scenes.shenCare.choices?.find((choice) => choice.id === "confess");
  assert.ok(medicine);
  assert.equal(applyChoice({ ...result, health: 2 }, medicine).health, 13);
});

test("血池密室的选择保留蛊虫与隐藏关系后果", () => {
  const report = scenes.bloodPool.choices?.find((choice) => choice.id === "report-jia");
  const blackmail = scenes.bloodPool.choices?.find((choice) => choice.id === "blackmail-jia");
  const ignore = scenes.bloodPool.choices?.find((choice) => choice.id === "ignore-jia");
  assert.ok(report && blackmail && ignore);
  assert.equal(applyChoice(chooseRole("healer"), report).flags.includes("乔无咎得血甲蛊"), true);
  assert.equal(applyChoice(chooseRole("healer"), blackmail).flags.includes("血甲蛊已得"), true);
  assert.equal(applyChoice(chooseRole("healer"), ignore).trust.jia, 1);
});

test("乔无咎取得血甲蛊会强化其本体战", () => {
  const state = { ...chooseRole("healer"), flags: ["乔无咎得血甲蛊"] };
  assert.equal(startBattle(state, scenes.lastGate).battle?.enemyHealth, 34);
  assert.equal(startBattle(state, scenes.qiaoDuel).battle?.enemyHealth, 22);
});

test("沈青萝关系足够时会在血卫战并肩并提升生命", () => {
  const state = { ...chooseRole("healer"), health: 6, trust: { qiao: 0, shen: 2, zhao: 0, jia: 0 } };
  const battle = startBattle(state, scenes.lastGate);
  assert.equal(battle.maxHealth, 13);
  assert.equal(battle.health, 9);
  assert.equal(battle.flags.includes("青萝并肩"), true);
});

test("援手条件足够时，血卫战败后仍可挑战赵黎", () => {
  const state = { ...chooseRole("healer"), trust: { qiao: 0, shen: 2, zhao: 2, jia: 2 } };
  const battle = startBattle(state, scenes.lastGate);
  const result = resolveBattleTurn({ ...battle, health: 2 }, "blood");
  assert.equal(result.sceneId, "bloodRage");
  assert.equal(result.flags.includes("赵黎可战"), true);
  assert.equal(result.flags.includes("贾贵援手"), true);
  assert.equal(result.health, 5);
});

test("贾贵黑刀与赵黎犹疑会削弱血流邪修", () => {
  const state = { ...chooseRole("healer"), flags: ["贾贵援手", "赵黎犹疑"] };
  const battle = startBattle(state, scenes.zhaoDuel);
  assert.equal(battle.battle?.enemyHealth, 16);
});

test("陆照野与赵黎交恶时会在血牌阵中放逐赵黎", () => {
  const exile = scenes.bloodCardChange.choices?.find((choice) => choice.id === "array-sword");
  assert.ok(exile);
  const exiled = applyChoice(chooseRole("swordsman"), exile);
  assert.equal(exiled.flags.includes("赵黎已放逐"), true);
  const battle = startBattle(exiled, scenes.lastGate);
  assert.equal(battle.battle?.enemyName, "四转蛊修 · 乔无咎");
  const result = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 1 } }, "blood");
  assert.equal(result.sceneId, "qiaoCleanExit");
  assert.equal(resolveEnding(result), "cleansed");
});

test("宁素衣能识破血牌陷阱，顾微尘可走叛徒路线", () => {
  const insight = scenes.bloodCardChange.choices?.find((choice) => choice.id === "array-insight");
  const traitor = scenes.bloodCardChange.choices?.find((choice) => choice.id === "traitor-accept");
  assert.ok(insight && traitor);
  assert.equal(canChoose(chooseRole("healer"), insight), true);
  assert.equal(canChoose(chooseRole("swordsman"), insight), false);
  const betrayal = applyChoice(chooseRole("heir"), traitor);
  assert.equal(betrayal.sceneId, "traitorEnd");
  const end = applyChoice(betrayal, scenes.traitorEnd.choices![0]);
  assert.equal(resolveEnding(end), "traitor");
});

test("未知之地救赵黎后可合战武意海，所有队友关系高则进入真结局", () => {
  const saveZhao = scenes.rescueChoice.choices?.find((choice) => choice.id === "save-zhao");
  assert.ok(saveZhao);
  const joined = applyChoice(chooseRole("healer"), saveZhao);
  assert.equal(joined.flags.includes("赵黎援阵"), true);
  const team = applyChoice({ ...chooseRole("healer"), trust: { qiao: 0, shen: 2, zhao: 2, jia: 2 } }, scenes.teamGather.choices![0]);
  assert.equal(team.sceneId, "trueEnding");
  const trueEnd = applyChoice(team, scenes.trueEnding.choices![0]);
  assert.equal(resolveEnding(trueEnd), "true");
});
