import assert from "node:assert/strict";
import test from "node:test";

import {
  applyChoice,
  canChoose,
  chooseRole,
  resolveBattleTurn,
  resolveEnding,
  scenes,
  startBattle,
} from "../lib/gu-tomb/game.ts";

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
  assert.equal(result.sceneId, "well");
  assert.equal(result.health, 1);
  assert.equal(result.time, 1);
  assert.equal(result.flags.includes("重伤"), true);
});

test("关键线索与信任能触发两人出墓", () => {
  const state = { ...chooseRole("healer"), clues: ["五人血印"], trust: { qiao: 0, shen: 2 } };
  assert.equal(resolveEnding(state), "together");
  assert.equal(resolveEnding({ ...state, time: 4 }), "trapped");
});

test("赵黎夺走血流蛊时，玩家命丧蛊墓", () => {
  const state = { ...chooseRole("healer"), flags: ["赵黎夺走血流蛊"], time: 9 };
  assert.equal(resolveEnding(state), "death");
});

test("血流蛊在夺蛊成功后能造成高伤并恢复生命", () => {
  const state = { ...chooseRole("healer"), health: 2, flags: ["血流蛊已得"] };
  const battle = startBattle(state, scenes.bloodRage);
  const result = resolveBattleTurn(battle, "bloodflow");
  assert.equal(result.sceneId, "bloodExit");
  assert.equal(result.health, 10);
  assert.equal(result.flags.includes("血卫尽灭"), true);
});
