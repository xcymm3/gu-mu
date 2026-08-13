import assert from "node:assert/strict";
import test from "node:test";

import { applyChoice, canChoose, chooseRole, getEnemyCondition, resolveBattleTurn, resolveEnding, scenes, startBattle, storyMeta } from "../lib/gu-tomb/game.ts";

test("三种无姓名男性身份沿用原有属性", () => {
  const medic = chooseRole("healer");
  const swordsman = chooseRole("swordsman");
  const heir = chooseRole("heir");
  assert.deepEqual([medic.maxHealth, medic.maxEssence], [14, 12]);
  assert.deepEqual([swordsman.maxHealth, swordsman.maxEssence], [15, 10]);
  assert.deepEqual([heir.maxHealth, heir.maxEssence], [12, 10]);
});

test("高神识仅落魄世家子具备", () => {
  assert.equal(chooseRole("healer").flags.includes("高神识"), false);
  assert.equal(chooseRole("swordsman").flags.includes("高神识"), false);
  assert.equal(chooseRole("heir").flags.includes("高神识"), true);
});

test("五幕节点合同固定为一、六、四、三与可变结局", () => {
  assert.deepEqual(storyMeta.acts.map((act) => act.nodes), [1, 6, 4, 3, "可变"]);
  const counts = [1, 2, 3, 4].map((act) => [...new Set(Object.values(scenes).filter((scene) => scene.act === act).map((scene) => scene.node))]);
  assert.deepEqual(counts[0], [1]);
  assert.deepEqual(counts[1], [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(counts[2], [1, 2, 3, 4]);
  assert.deepEqual(counts[3], [1, 2, 3]);
});

test("大雾节点的四个选择分别锁定四条同行路线", () => {
  for (const route of ["zhao", "ji", "xue", "su"] as const) {
    const choice = scenes.fog.choices?.find((item) => item.effect?.route === route);
    assert.ok(choice);
    assert.equal(applyChoice(chooseRole(), choice).route, route);
  }
});

test("大雾节点只展示好感度前二的同行者", () => {
  const state = { ...chooseRole(), trust: { zhao: 0, ji: 3, xue: 0, su: 2, qiao: 0 } };
  const jiChoice = scenes.fog.choices?.find((item) => item.effect?.route === "ji")!;
  const suChoice = scenes.fog.choices?.find((item) => item.effect?.route === "su")!;
  const zhaoChoice = scenes.fog.choices?.find((item) => item.effect?.route === "zhao")!;
  assert.equal(canChoose(state, jiChoice), true);
  assert.equal(canChoose(state, suChoice), true);
  assert.equal(canChoose(state, zhaoChoice), false);
});

test("高神识角色第一幕多出识破棋局选项", () => {
  const choice = scenes.gate.choices?.find((item) => item.id === "insight");
  assert.ok(choice);
  assert.equal(canChoose(chooseRole("heir"), choice), true);
  assert.equal(canChoose(chooseRole("healer"), choice), false);
});

test("苏莹真结局选项只在三枚线索齐备时出现", () => {
  const choice = scenes.routeTruth.choices?.find((item) => item.id === "shield-su");
  assert.ok(choice);
  const base = { ...chooseRole(), route: "su" as const };
  assert.equal(canChoose(base, choice), false);
  assert.equal(canChoose({ ...base, flags: ["旧玉发烫", "生门低语"] }, choice), false);
  assert.equal(canChoose({ ...base, flags: ["旧玉发烫", "生门低语", "活符低语"] }, choice), true);
});

test("赵黎线的冰寒蛊简会开启节点三的决战变体", () => {
  const choice = scenes.finale.choices?.find((item) => item.id === "duel-zhao");
  assert.ok(choice);
  const state = { ...chooseRole(), route: "zhao" as const, flags: ["冰寒蛊简"] };
  assert.equal(canChoose(state, choice), true);
  const next = applyChoice(state, choice);
  assert.equal(next.sceneId, "zhaoBattle");
  assert.equal(startBattle(next, scenes.zhaoBattle).battle?.enemyName, "赵黎");
});

test("真结局路线的墓主战可正常开启，敌方血量仍隐性显示", () => {
  const state = { ...chooseRole(), route: "su" as const, flags: ["苏莹存活"] };
  const battle = startBattle(state, scenes.masterBattle);
  assert.equal(battle.battle?.enemyName, "苏衍");
  assert.equal(getEnemyCondition(28, 28), "健康");
  assert.equal(getEnemyCondition(8, 28), "重伤");
});

test("显式结局优先于时辰结算", () => {
  assert.equal(resolveEnding({ ...chooseRole(), flags: ["结局:true"], time: 9 }), "true");
  assert.equal(resolveEnding({ ...chooseRole(), time: 4 }), "trapped");
});

test("血刃蛊使攻击伤害翻倍", () => {
  const state = { ...chooseRole("swordsman"), flags: ["血刃蛊"] };
  const battle = startBattle(state, scenes.puppets)!;
  assert.ok(battle.battle);
  const before = battle.battle!.enemyHealth;
  const after = resolveBattleTurn(battle, "blood");
  assert.equal(before - after.battle!.enemyHealth, 8); // 剑修攻击4 × 2 = 8
});

test("血甲蛊抵挡本回合全部伤害", () => {
  const state = { ...chooseRole("healer"), flags: ["血甲蛊"] };
  const battle = startBattle(state, scenes.puppets)!;
  const beforeHp = battle.health;
  const after = resolveBattleTurn(battle, "armor");
  assert.equal(after.health, beforeHp); // 免全伤，不掉血
});

test("隐藏线结局可被 resolveEnding 解析", () => {
  assert.equal(resolveEnding({ ...chooseRole(), flags: ["结局:traitor"] }), "traitor");
  assert.equal(resolveEnding({ ...chooseRole(), flags: ["结局:seer"] }), "seer");
});
