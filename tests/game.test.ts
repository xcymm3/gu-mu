import assert from "node:assert/strict";
import test from "node:test";

import { getCharacterExpressionAsset, getVisualAsset, visualAssetManifest } from "../lib/xue-gu-yin/assets.ts";
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
    asset: "character.su-ying.wary",
    position: "right",
    expression: "relieved",
  });
});

test("资源键全部从统一清单解析，纪清寒占位立绘指向现有资源", () => {
  assert.ok(Object.keys(visualAssetManifest).length >= 10);
  const portrait = getVisualAsset("character.ji-qinghan.placeholder");
  assert.equal(portrait.kind, "image");
  if (portrait.kind === "image") assert.equal(portrait.src, "/characters/ji-qinghan-v1.webp");
});

test("第二幕六个固定节点均已迁移为原生阅读事件", () => {
  const actTwoIds = ["swarm", "shadow", "chamber", "illusion", "puppets", "fog"] as const;
  for (const sceneId of actTwoIds) {
    const scene = scenes[sceneId];
    const presentation = resolveScenePresentation(chooseRole(), scene);
    assert.equal(scene.text, undefined, `${sceneId} 仍保留旧 text`);
    assert.ok(presentation.beats.length > 0, `${sceneId} 没有阅读节拍`);
    assert.ok(presentation.events.some((event) => event.type === "narration"));
  }
  assert.equal(resolveScenePresentation(chooseRole(), scenes.swarm).choices.length, scenes.swarm.choices?.length);
  assert.equal(resolveScenePresentation(chooseRole(), scenes.puppets).battle?.enemyName, "铜皮傀儡");
});

test("第二幕条件事件仍会响应旧旗标", () => {
  const base = chooseRole();
  const aided = { ...base, flags: [...base.flags, "苏莹低语"] };
  assert.equal(resolveScenePresentation(base, scenes.puppets).text.includes("暗红丹丸"), false);
  assert.equal(resolveScenePresentation(aided, scenes.puppets).text.includes("暗红丹丸"), true);

  const insightful = { ...base, flags: [...base.flags, "识破棋局"] };
  assert.equal(resolveScenePresentation(base, scenes.fog).text.includes("拐入一条"), false);
  assert.equal(resolveScenePresentation(insightful, scenes.fog).text.includes("拐入一条"), true);
});

test("第三幕四个固定节点及暗线均已迁移为原生事件", () => {
  const routeState = { ...chooseRole(), route: "ji" as const };
  for (const sceneId of ["routeTrial", "routeTruth", "routeCost", "bloodGate", "shadowQiao", "shadowTruth", "shadowBargain", "shadowBetrayal"] as const) {
    const scene = scenes[sceneId];
    const presentation = resolveScenePresentation(routeState, scene);
    assert.equal(scene.text, undefined, `${sceneId} 仍保留旧 text`);
    assert.ok(presentation.beats.length > 0, `${sceneId} 没有阅读节拍`);
  }
  assert.equal(resolveScenePresentation(routeState, scenes.routeTrial).choices.length, scenes.routeTrial.choices?.length);
  assert.equal(resolveScenePresentation(routeState, scenes.bloodGate).choices.length, 1);
});

test("第三幕同行路线保持各自的人物演出和条件内容", () => {
  const expectations = [
    ["zhao", "赵黎", "蛊简"],
    ["ji", "纪清寒", "活不过四十岁"],
    ["xue", "薛逢", "活蛊线"],
    ["su", "苏莹", "蛊不可祭"],
  ] as const;
  for (const [route, name, phrase] of expectations) {
    const presentation = resolveScenePresentation({ ...chooseRole(), route }, scenes.routeTrial);
    assert.ok(presentation.text.includes(name));
    assert.ok(presentation.text.includes(phrase));
  }
  const tailed = resolveScenePresentation({ ...chooseRole(), route: "ji", flags: ["曾尾行乔无咎"] }, scenes.routeTrial);
  assert.ok(tailed.text.includes("有人早来过"));
});

test("第三幕正式背景与苏衍透明立绘均从资源清单加载", () => {
  const assets = [
    ["background.fog-passage", "/backgrounds/fog-passage-v1.webp"],
    ["background.trap-passage", "/backgrounds/trap-passage-v1.webp"],
    ["background.control-room", "/backgrounds/control-room-v1.webp"],
    ["character.su-yan.neutral", "/characters/su-yan-v1.webp"],
  ] as const;
  for (const [key, src] of assets) {
    const asset = getVisualAsset(key);
    assert.equal(asset.kind, "image");
    if (asset.kind === "image") assert.equal(asset.src, src);
  }
  assert.equal(getCharacterExpressionAsset("su-yan", "awakened"), "character.su-yan.awakened");
  const shadow = resolveScenePresentation(chooseRole(), scenes.shadowTruth);
  assert.equal(shadow.beats[0]?.background, "background.control-room");
});

test("五名主要人物基础立绘均从透明 WebP 资源加载", () => {
  const portraits = [
    ["character.zhao-li.neutral", "/characters/zhao-li-v1.webp"],
    ["character.ji-qinghan.neutral", "/characters/ji-qinghan-v1.webp"],
    ["character.xue-feng.neutral", "/characters/xue-feng-v1.webp"],
    ["character.su-ying.neutral", "/characters/su-ying-v1.webp"],
    ["character.qiao-wujiu.neutral", "/characters/qiao-wujiu-v1.webp"],
  ] as const;
  for (const [key, src] of portraits) {
    const portrait = getVisualAsset(key);
    assert.equal(portrait.kind, "image");
    if (portrait.kind === "image") assert.equal(portrait.src, src);
  }
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
