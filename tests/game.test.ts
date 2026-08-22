import assert from "node:assert/strict";
import test from "node:test";

import { getVisualAsset, visualAssetManifest } from "../lib/xue-gu-yin/assets.ts";
import { applyChoice, canChoose, chooseRole, endingAccess, getEnemyCondition, resolveBattleTurn, resolveEnding, resolveRandomChoice, resolveSceneEvents, resolveScenePresentation, scenes, startBattle, storyMeta, type Scene } from "../lib/xue-gu-yin/game.ts";

test("三种无姓名男性身份沿用原有属性", () => {
  const medic = chooseRole("healer");
  const swordsman = chooseRole("swordsman");
  const heir = chooseRole("heir");
  assert.deepEqual([medic.maxHealth, medic.maxEssence], [14, 12]);
  assert.deepEqual([swordsman.maxHealth, swordsman.maxEssence], [15, 10]);
  assert.deepEqual([heir.maxHealth, heir.maxEssence], [12, 10]);
});

test("游方蛊医的结局一览不包含击败苏衍的真结局", () => {
  assert.equal(endingAccess.healer.includes("true"), false);
  assert.equal(endingAccess.swordsman.includes("true"), true);
  assert.equal(endingAccess.heir.includes("true"), true);
});

test("高神识仅世家之子具备", () => {
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

test("第一幕已迁移为原生事件且保留全部选择", () => {
  const presentation = resolveScenePresentation(chooseRole(), scenes.gate);
  assert.equal(presentation.background, "background.tomb-gate");
  assert.equal(scenes.gate.text, undefined);
  assert.ok(presentation.text.includes("诸位道友，此地荒原之下"));
  assert.equal(presentation.choices.length, scenes.gate.choices?.length);
  assert.ok(presentation.events.some((event) => event.type === "narration"));
  assert.ok(presentation.events.some((event) => event.type === "dialogue"));
  assert.ok(presentation.events.some((event) => event.type === "choice"));
});

test("战斗节点会生成结构化 battle 事件而不改变战斗配置", () => {
  const events = resolveSceneEvents(chooseRole(), scenes.puppets);
  const battleEvent = events.find((event) => event.type === "battle");
  assert.ok(battleEvent && battleEvent.type === "battle");
  if (!battleEvent || battleEvent.type !== "battle") throw new Error("战斗事件未生成");
  assert.equal(battleEvent.config.enemyName, "铜皮傀儡");
  assert.equal(battleEvent.config.enemyHealth, 12);
});

test("原生视觉小说事件可以与旧场景并存", () => {
  const nativeScene: Scene = {
    id: "native-test",
    act: 2,
    node: 1,
    chapter: "测试",
    title: "原生事件",
    events: [
      { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.placeholder", position: "right", expression: "alert" },
      { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "别动。", expression: "alert", position: "center" },
      { type: "choice", choices: [{ id: "wait", label: "停下", next: "gate" }] },
    ],
  };
  const presentation = resolveScenePresentation(chooseRole(), nativeScene);
  assert.equal(presentation.background, "background.tomb-corridor");
  assert.equal(presentation.text, "别动。");
  assert.deepEqual(presentation.choices.map((choice) => choice.id), ["wait"]);
  assert.deepEqual(presentation.characters, [{ id: "ji-qinghan", asset: "character.ji-qinghan.alert", position: "center", expression: "alert" }]);
});

test("每段正文保存当时的背景、说话人与立绘表情", () => {
  const eventScene: Scene = {
    id: "beat-test",
    act: 1,
    node: 1,
    chapter: "测试",
    title: "阅读帧",
    events: [
      { type: "background", asset: "background.tomb-gate" },
      { type: "narration", text: "雨声压住了呼吸。", mode: "center" },
      { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "neutral" },
      { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "退后。", expression: "alert", position: "right" },
    ],
  };
  const presentation = resolveScenePresentation(chooseRole(), eventScene);
  assert.equal(presentation.beats.length, 2);
  assert.deepEqual(presentation.beats[0], {
    kind: "narration",
    text: "雨声压住了呼吸。",
    speakerId: null,
    displayName: "旁白",
    mode: "center",
    background: "background.tomb-gate",
    characters: [],
  });
  assert.equal(presentation.beats[1].displayName, "纪清寒");
  assert.equal(presentation.beats[1].characters[0]?.expression, "alert");
});

test("角色显隐事件会按顺序生成舞台最终阵容", () => {
  const eventScene: Scene = {
    id: "cast-test",
    act: 3,
    node: 1,
    chapter: "测试",
    title: "阵容事件",
    events: [
      { type: "character", action: "show", character: "zhao-li", position: "left", expression: "neutral" },
      { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
      { type: "character", action: "expression", character: "su-ying", expression: "relieved" },
      { type: "character", action: "hide", character: "zhao-li" },
      { type: "narration", text: "雾里只剩一道人影。" },
    ],
  };
  const presentation = resolveScenePresentation(chooseRole(), eventScene);
  assert.deepEqual(presentation.visibleCharacters, ["su-ying"]);
  assert.deepEqual(presentation.characters[0], {
    id: "su-ying",
    asset: "character.su-ying.placeholder",
    position: "right",
    expression: "relieved",
  });
});

test("资源键全部从统一清单解析，纪清寒占位立绘指向现有资源", () => {
  assert.ok(Object.keys(visualAssetManifest).length >= 10);
  const portrait = getVisualAsset("character.ji-qinghan.placeholder");
  assert.equal(portrait.kind, "image");
  if (portrait.kind === "image") assert.equal(portrait.src, "/characters/ji-qinghan-placeholder.webp");
});

test("正式墓门背景从统一资源清单加载", () => {
  const background = getVisualAsset("background.tomb-gate");
  assert.equal(background.kind, "image");
  if (background.kind === "image") assert.equal(background.src, "/backgrounds/tomb-gate-v1.png");
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
  const jiChoice = scenes.fog.choices?.find((item) => item.effect?.route === "ji");
  const suChoice = scenes.fog.choices?.find((item) => item.effect?.route === "su");
  const zhaoChoice = scenes.fog.choices?.find((item) => item.effect?.route === "zhao");
  assert.ok(jiChoice);
  assert.ok(suChoice);
  assert.ok(zhaoChoice);
  assert.equal(canChoose(state, jiChoice), true);
  assert.equal(canChoose(state, suChoice), true);
  assert.equal(canChoose(state, zhaoChoice), false);
});

test("大雾节点尾行乔无咎入口仅在识破棋局时可用，退回暗线后回 fog 抓人", () => {
  const follow = scenes.fog.choices?.find((item) => item.id === "follow-qiao");
  assert.ok(follow);
  assert.equal(follow.next, "shadowQiao");
  assert.equal(canChoose(chooseRole(), follow), false);
  assert.equal(canChoose({ ...chooseRole(), flags: ["识破棋局"] }, follow), true);
  // 暗线退回点回到 fog（而非 puppets），保证塌陷后仍可锁定同行者
  const retreat = scenes.shadowQiao.choices?.find((item) => item.id === "retreat");
  const flee = scenes.shadowTruth.choices?.find((item) => item.id === "flee");
  assert.equal(retreat?.next, "fog");
  assert.equal(flee?.next, "fog");
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

test("让苏莹先挑后随机获得一种蛊（血甲蛊或血刃蛊），result 写明所得蛊", () => {
  const choice = scenes.chamber.choices?.find((item) => item.id === "yield-su");
  assert.ok(choice);
  assert.deepEqual(choice.effect?.flags, ["活符低语"]);
  // roll=0 → 血甲蛊
  const armor = resolveRandomChoice(choice, () => 0);
  assert.ok(armor.effect?.flags?.includes("血甲蛊"));
  assert.ok(armor.effect?.flags?.includes("活符低语"));
  assert.ok(armor.result?.includes("甲纹森森"));
  // roll 接近 1 → 血刃蛊
  const blade = resolveRandomChoice(choice, () => 0.99);
  assert.ok(blade.effect?.flags?.includes("血刃蛊"));
  assert.ok(blade.result?.includes("血芒吞吐"));
  // 应用后状态同时携带活符低语与随机蛊 flag
  const next = applyChoice(chooseRole(), armor);
  assert.ok(next.flags.includes("活符低语"));
  assert.ok(next.flags.includes("血甲蛊") || next.flags.includes("血刃蛊"));
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
