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

test("角色的初始生命与回春蛊数值符合当前战斗设定", () => {
  assert.equal(chooseRole("healer").maxHealth, 14);
  assert.equal(chooseRole("swordsman").maxHealth, 15);
  assert.equal(chooseRole("heir").maxHealth, 12);
});

test("血针机关按一、三、六点伤害循环", () => {
  const battle = startBattle(chooseRole("healer"), scenes.bloodTrap);
  assert.equal(battle.battle?.intent.damage, 1);
  const second = resolveBattleTurn(battle, "blood");
  assert.equal(second.battle?.intent.damage, 3);
  const third = resolveBattleTurn(second, "blood");
  assert.equal(third.battle?.intent.damage, 6);
  const looped = resolveBattleTurn(third, "blood");
  assert.equal(looped.battle?.intent.damage, 1);
});

test("赵黎的血幕免疫伤害并反弹来袭蛊术", () => {
  const first = startBattle(chooseRole("healer"), scenes.zhaoDuel);
  const second = resolveBattleTurn(first, "blood");
  const mirror = resolveBattleTurn(second, "blood");
  assert.equal(mirror.battle?.intent.reflect, true);
  const reflected = resolveBattleTurn(mirror, "blood");
  assert.equal(reflected.battle?.enemyHealth, mirror.battle?.enemyHealth);
  assert.equal(reflected.health, mirror.health - 3);
});

test("武意海的蛊印会同时压低生命与真元", () => {
  const battle = startBattle(chooseRole("healer"), scenes.wuTeamDuel);
  const result = resolveBattleTurn(battle, "blood");
  assert.equal(result.health, 12);
  assert.equal(result.essence, 10);
  assert.equal(result.battle?.intent.damage, 4);
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

test("沈砚玉牌与信任能触发两人出墓，五人血印不再参与判定", () => {
  const state = { ...chooseRole("healer"), clues: ["沈砚玉牌"], trust: { qiao: 0, shen: 2, zhao: 0, jia: 0 } };
  assert.equal(resolveEnding(state), "together");
  assert.equal(resolveEnding({ ...state, time: 4 }), "trapped");
  assert.equal(resolveEnding({ ...state, clues: ["五人血印"] }), "alone");
});

test("察看墓门蛊纹只揭示乔无咎曾多次出入，不改变后续主线", () => {
  const inspectDoor = scenes.entrance.choices?.find((choice) => choice.id === "read");
  assert.ok(inspectDoor);
  const inspected = applyChoice(chooseRole("healer"), inspectDoor);
  assert.equal(inspected.sceneId, "sealInsight");
  assert.deepEqual(inspected.clues, []);
  assert.equal(applyChoice(inspected, scenes.sealInsight.choices![0]).sceneId, "bloodDoor");
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
  assert.equal(battle.essence, 10);
  assert.equal(startBattle(chooseRole("healer"), scenes.corpseFight).essence, 12);
});

test("真元耗尽后只能调息并恢复三点", () => {
  const state = { ...chooseRole("healer"), essence: 0 };
  const battle = startBattle(state, scenes.corpseFight);
  const exhausted = { ...battle, essence: 0 };
  assert.equal(resolveBattleTurn(exhausted, "blood"), exhausted);
  const rested = resolveBattleTurn(exhausted, "rest");
  assert.equal(rested.essence, 3);
  assert.equal(rested.health, 11);
});

test("陆照野击败尸灯傀儡时必定进入实力惊异的特殊余波，且不会承受击杀反击", () => {
  const battle = startBattle(chooseRole("swordsman"), scenes.corpseFight);
  const result = resolveBattleTurn(battle, "sword");
  assert.equal(result.sceneId, "corpseAftermath");
  assert.equal(result.health, 15);
  assert.equal(result.essence, 6);
  const ordinaryKill = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 4 } }, "blood");
  assert.equal(ordinaryKill.sceneId, "corpseAftermath");
});

test("回春蛊先恢复七点生命，再承受本回合攻击", () => {
  const battle = startBattle({ ...chooseRole("healer"), health: 2 }, scenes.corpseFight);
  const result = resolveBattleTurn(battle, "heal");
  assert.equal(result.health, 6);
  assert.equal(result.essence, 10);
});

test("血甲蛊在本回合完全免疫敌方伤害", () => {
  const battle = startBattle({ ...chooseRole("healer"), flags: ["血甲蛊已得"] }, scenes.corpseFight);
  const result = resolveBattleTurn(battle, "armor");
  assert.equal(result.health, 14);
  assert.equal(result.essence, 11);
});

test("尸灯傀儡战后先进入青萝关心的疗伤节点", () => {
  const battle = startBattle(chooseRole("healer"), scenes.corpseFight);
  const result = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 1 } }, "blood");
  assert.equal(result.sceneId, "shenCare");
  const medicine = scenes.shenCare.choices?.find((choice) => choice.id === "confess");
  assert.ok(medicine);
  assert.equal(applyChoice({ ...result, health: 2 }, medicine).health, 14);
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

test("药物回复事件恢复十点生命，贾贵补给会提高真元上限", () => {
  const selfMedicine = scenes.shellCorridor.choices?.find((choice) => choice.id === "take-draught");
  const jiaMedicine = scenes.lampRoom.choices?.find((choice) => choice.id === "jia-ointment");
  const jiaRest = scenes.needleRest.choices?.find((choice) => choice.id === "take-jia-salve");
  assert.ok(selfMedicine && jiaMedicine && jiaRest);
  assert.equal(applyChoice({ ...chooseRole("healer"), health: 1 }, selfMedicine).health, 11);
  assert.equal(applyChoice(chooseRole("healer"), jiaMedicine).maxEssence, 15);
  assert.equal(applyChoice(chooseRole("healer"), jiaRest).maxEssence, 15);
  assert.equal(startBattle(applyChoice(chooseRole("healer"), jiaMedicine), scenes.bloodTrap).essence, 15);
});

test("非首领战胜利后回复两点，重伤战败后保留一滴生命", () => {
  const battle = startBattle({ ...chooseRole("healer"), health: 5 }, scenes.corpseFight);
  const victory = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 1 } }, "blood");
  assert.equal(victory.health, 7);
  const defeat = resolveBattleTurn({ ...startBattle({ ...chooseRole("healer"), health: 1 }, scenes.corpseFight) }, "blood");
  assert.equal(defeat.health, 1);
});

test("乔无咎取得血甲蛊会强化其本体战", () => {
  const state = { ...chooseRole("healer"), flags: ["乔无咎得血甲蛊"] };
  assert.equal(startBattle(state, scenes.lastGate).battle?.enemyHealth, 20);
  assert.equal(startBattle(state, scenes.qiaoDuel).battle?.enemyHealth, 22);
  assert.equal(scenes.bloodPool.paragraphs[0].includes("血卫必会更难对付"), false);
});

test("沈青萝关系足够时会在赵黎或乔无咎战开场并肩", () => {
  const state = { ...chooseRole("healer"), health: 6, trust: { qiao: 0, shen: 2, zhao: 0, jia: 0 } };
  const guard = startBattle(state, scenes.lastGate);
  assert.equal(guard.maxHealth, 14);
  assert.equal(guard.health, 6);
  assert.equal(guard.flags.includes("青萝并肩"), true);
  const zhao = startBattle(guard, scenes.zhaoDuel);
  assert.equal(zhao.maxHealth, 17);
  assert.equal(zhao.health, 17);
  assert.equal(startBattle(zhao, scenes.qiaoDuel).maxHealth, 17);
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

test("陆照野与赵黎交恶后会因沈青萝关系进入不同裂阵路线", () => {
  const exile = scenes.bloodCardChange.choices?.find((choice) => choice.id === "array-sword");
  assert.ok(exile);
  const repaired = applyChoice(chooseRole("swordsman"), exile);
  assert.equal(repaired.flags.includes("赵黎已放逐"), true);
  assert.equal(repaired.sceneId, "swordArrayRepair");
  assert.equal(applyChoice(repaired, scenes.swordArrayRepair.choices![0]).sceneId, "bloodHall");
  const forced = applyChoice({ ...chooseRole("swordsman"), trust: { qiao: 0, shen: 2, zhao: 0, jia: 0 } }, exile);
  assert.equal(forced.sceneId, "swordArrayForce");
  assert.equal(applyChoice(forced, scenes.swordArrayForce.choices![0]).sceneId, "unknownRoom");
  const battle = startBattle(repaired, scenes.lastGate);
  assert.equal(battle.battle?.enemyName, "四转蛊修 · 乔无咎");
  const result = resolveBattleTurn({ ...battle, battle: { ...battle.battle!, enemyHealth: 1 } }, "blood");
  assert.equal(result.sceneId, "qiaoCleanExit");
  assert.equal(resolveEnding(result), "cleansed");
});

test("陆照野在武意海盟约线可进入完整的血流反戈战", () => {
  const steal = scenes.wuAlliance.choices?.find((choice) => choice.id === "wu-steal");
  assert.ok(steal);
  const duel = applyChoice(chooseRole("swordsman"), steal);
  assert.equal(duel.sceneId, "wuDuel");
  assert.equal(startBattle(duel, scenes.wuDuel).battle?.enemyName, "五转蛊修 · 武意海");
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
