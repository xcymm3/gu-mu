import assert from "node:assert/strict";
import test from "node:test";

import { applyChoice, canChoose, chooseRole, getEnemyCondition, resolveEnding, scenes, startBattle, storyMeta } from "../lib/gu-tomb/game.ts";

test("三种无姓名男性身份沿用原有属性", () => {
  const medic = chooseRole("healer");
  const swordsman = chooseRole("swordsman");
  const heir = chooseRole("heir");
  assert.deepEqual([medic.maxHealth, medic.maxEssence], [14, 12]);
  assert.deepEqual([swordsman.maxHealth, swordsman.maxEssence], [15, 10]);
  assert.deepEqual([heir.maxHealth, heir.maxEssence], [12, 10]);
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

test("苏莹真结局选项只在三枚线索齐备时出现", () => {
  const choice = scenes.routeTruth.choices?.find((item) => item.id === "shield-su");
  assert.ok(choice);
  const base = { ...chooseRole(), route: "su" as const };
  assert.equal(base.flags.includes("旧玉发烫"), true);
  assert.equal(canChoose(base, choice), false);
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
  assert.equal(battle.battle?.enemyName, "五转墓主");
  assert.equal(getEnemyCondition(28, 28), "健康");
  assert.equal(getEnemyCondition(8, 28), "重伤");
});

test("显式结局优先于时辰结算", () => {
  assert.equal(resolveEnding({ ...chooseRole(), flags: ["结局:true"], time: 9 }), "true");
  assert.equal(resolveEnding({ ...chooseRole(), time: 4 }), "trapped");
});
