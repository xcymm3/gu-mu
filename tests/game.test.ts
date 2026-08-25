import assert from "node:assert/strict";
import test from "node:test";

import { getCharacterExpressionAsset, getVisualAsset, visualAssetManifest } from "../lib/xue-gu-yin/assets.ts";
import { audioAssetManifest, defaultAudioSettings, sanitizeAudioSettings, sceneAudioProfile } from "../lib/xue-gu-yin/audio.ts";
import { applyChoice, canChoose, chooseRole, endingAccess, endings, getEnemyCondition, lockPersonalityRoute, personalityRouteMap, resolveBattleTurn, resolveDominantPersonalities, resolveEnding, resolvePersonalityRoute, resolveRandomChoice, resolveSceneEvents, resolveScenePresentation, scenes, startBattle, storyMeta, type Scene } from "../lib/xue-gu-yin/game.ts";
import { appendBacklog, autoAdvanceDelay, canRunReadingMode, readingFrameKey } from "../lib/xue-gu-yin/reading.ts";
import { actFiveRouteSceneIds, actFourRouteSceneIds, actThreeRouteSceneIds } from "../lib/xue-gu-yin/story/routes/contract.ts";

test("阅读帧键稳定且正文变化会生成新键", () => {
  const first = readingFrameKey("gate", 0, 0, "夜雨落在墓门前。");
  assert.equal(first, readingFrameKey("gate", 0, 0, "夜雨落在墓门前。"));
  assert.notEqual(first, readingFrameKey("gate", 0, 0, "夜雨停在墓门前。"));
});

test("历史记录去重并保留最近条目", () => {
  const entry = { id: "gate:0", sceneId: "gate", sceneTitle: "夜雨墓门", speaker: "旁白", text: "夜雨落下。" };
  assert.deepEqual(appendBacklog([entry], entry), [entry]);
  const second = { ...entry, id: "gate:1", text: "墓门洞开。" };
  assert.deepEqual(appendBacklog([entry], second, 1), [second]);
});

test("自动播放延时随文本增长并设有上限", () => {
  assert.ok(autoAdvanceDelay("短句") < autoAdvanceDelay("这是一段明显更长、需要更多阅读时间的文字。"));
  assert.equal(autoAdvanceDelay("长".repeat(500)), 3600);
});

test("自动与快进在选项、战斗和覆盖层暂停", () => {
  assert.equal(canRunReadingMode({ hasOverlay: false, inBattle: false, hasPendingResult: false, hasBlockingAction: false }), true);
  assert.equal(canRunReadingMode({ hasOverlay: true, inBattle: false, hasPendingResult: false, hasBlockingAction: false }), false);
  assert.equal(canRunReadingMode({ hasOverlay: false, inBattle: true, hasPendingResult: false, hasBlockingAction: false }), false);
  assert.equal(canRunReadingMode({ hasOverlay: false, inBattle: false, hasPendingResult: false, hasBlockingAction: true }), false);
});

test("四种隐藏人格映射到四条新路线", () => {
  assert.deepEqual(personalityRouteMap, {
    power: "zhao",
    compassion: "ji",
    insight: "su",
    scheme: "traitor",
  });
  for (const [personality, route] of Object.entries(personalityRouteMap)) {
    const state = {
      ...chooseRole(),
      personality: { power: 0, compassion: 0, insight: 0, scheme: 0, [personality]: 2 },
    };
    assert.equal(resolvePersonalityRoute(state.personality), route);
    assert.equal(lockPersonalityRoute(state).route, route);
    assert.equal(lockPersonalityRoute(state).routeLocked, true);
  }
});

test("人格并列时等待最终确认，且只能从最高人格中选择", () => {
  const state = {
    ...chooseRole(),
    personality: { power: 2, compassion: 2, insight: 1, scheme: 0 },
  };
  assert.deepEqual(resolveDominantPersonalities(state.personality), ["power", "compassion"]);
  assert.equal(resolvePersonalityRoute(state.personality), null);
  assert.equal(lockPersonalityRoute(state).route, null);
  assert.equal(lockPersonalityRoute(state, "insight").route, null);
  assert.equal(lockPersonalityRoute(state, "compassion").route, "ji");
  assert.equal(canChoose(state, { id: "tie-ji", label: "确认重情", next: "gate", requires: { dominantPersonality: "compassion" } }), true);
  assert.equal(canChoose(state, { id: "tie-su", label: "确认察微", next: "gate", requires: { dominantPersonality: "insight" } }), false);
});

test("共通线选项可以累计隐藏人格而不提前锁定路线", () => {
  const next = applyChoice(chooseRole(), {
    id: "seek-power",
    label: "观察赵黎的血道秘术",
    next: "swarm",
    effect: { personality: { power: 2 } },
  });
  assert.deepEqual(next.personality, { power: 2, compassion: 0, insight: 0, scheme: 0 });
  assert.equal(next.route, null);
  assert.equal(next.routeLocked, false);
});

test("路线锁定后人格和路线都不会被后续选项改变", () => {
  const locked = lockPersonalityRoute({
    ...chooseRole(),
    personality: { power: 3, compassion: 0, insight: 0, scheme: 0 },
  });
  const next = applyChoice(locked, {
    id: "late-choice",
    label: "后续选择",
    next: "gate",
    effect: { personality: { compassion: 9 }, route: "su" },
  });
  assert.equal(next.route, "zhao");
  assert.equal(next.routeLocked, true);
  assert.deepEqual(next.personality, locked.personality);
});

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

test("五幕节点合同固定为共通线一、六与分线四、六、二", () => {
  assert.deepEqual(storyMeta.acts.map((act) => act.nodes), [1, 6, "每线 4", "每线 6", "每线 2"]);
  const counts = [1, 2, 3, 4, 5].map((act) => [...new Set(Object.values(scenes).filter((scene) => scene.act === act).map((scene) => scene.node))]);
  assert.deepEqual(counts[0], [1]);
  assert.deepEqual(counts[1], [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(counts[2], [1, 2, 3, 4]);
  assert.deepEqual(counts[3], [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(counts[4], [1, 2]);
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
    transition: "cut",
    effects: [],
    sounds: [],
  });
  assert.equal(presentation.beats[1].displayName, "纪清寒");
  assert.equal(presentation.beats[1].characters[0]?.expression, "alert");
});

test("音效与镜头事件会附着到对应阅读帧", () => {
  const eventScene: Scene = {
    id: "effect-test",
    act: 4,
    node: 1,
    chapter: "测试",
    title: "镜头事件",
    events: [
      { type: "background", asset: "background.blood-chamber", transition: "fade" },
      { type: "narration", text: "血池轰然炸开。" },
      { type: "effect", effect: "shake", tone: "danger" },
      { type: "sound", asset: "sfx.battle-danger" },
    ],
  };
  const [beat] = resolveScenePresentation(chooseRole(), eventScene).beats;
  assert.equal(beat.transition, "fade");
  assert.deepEqual(beat.effects, [{ effect: "shake", tone: "danger" }]);
  assert.deepEqual(beat.sounds, ["sfx.battle-danger"]);
});

test("音频清单、场景分轨与设置清洗保持稳定", () => {
  assert.equal(audioAssetManifest["bgm.tomb-depths"].channel, "music");
  assert.deepEqual(sceneAudioProfile({ act: 4 }), { music: "bgm.blood-awakening", ambience: "amb.blood-pulse" });
  assert.deepEqual(sceneAudioProfile({ act: 1 }), { music: "bgm.tomb-depths", ambience: "amb.rain-gate" });
  assert.deepEqual(sanitizeAudioSettings({ muted: true, master: 130, music: -4, ambience: "40", sfx: null }), {
    ...defaultAudioSettings,
    muted: true,
    master: 100,
    music: 0,
    ambience: 40,
    sfx: 0,
  });
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

test("第三幕四条路线各自拥有四个独立固定节点", () => {
  const binarySceneIds = new Set(["zhaoPrice", "jiPromise", "suTrail", "traitorTrail"]);
  const allSceneIds = Object.values(actThreeRouteSceneIds).flat();
  assert.equal(new Set(allSceneIds).size, 16);
  for (const [route, sceneIds] of Object.entries(actThreeRouteSceneIds)) {
    assert.equal(sceneIds.length, 4);
    sceneIds.forEach((sceneId, index) => {
      const scene = scenes[sceneId];
      assert.ok(scene, `${route} 缺少 ${sceneId}`);
      assert.equal(scene.act, 3);
      assert.equal(scene.node, index + 1);
      assert.equal(scene.text, undefined);
      assert.ok(resolveScenePresentation({ ...chooseRole(), route: route as "zhao" | "ji" | "su" | "traitor" }, scene).beats.length > 0);
      assert.equal(scene.choices?.length, binarySceneIds.has(sceneId) ? 2 : 1, `${sceneId} 的选项数量不符合设计`);
    });
  }
  for (const removed of ["routeTrial", "routeTruth", "routeCost", "bloodGate", "shadowQiao", "shadowTruth", "shadowBargain", "shadowBetrayal"]) {
    assert.equal(scenes[removed], undefined, `${removed} 旧共用节点仍未移除`);
  }
});

test("每条个人线固定包含两个只改变对话的二选一节点", () => {
  const expectedBinaryScenes = {
    zhao: ["zhaoPrice", "zhaoAwakening"],
    ji: ["jiPromise", "jiArrayTruth"],
    su: ["suTrail", "suMasterTruth"],
    traitor: ["traitorTrail", "traitorQiaoTriumph"],
  } as const;

  for (const route of ["zhao", "ji", "su", "traitor"] as const) {
    const routeSceneIds = [
      ...actThreeRouteSceneIds[route],
      ...actFourRouteSceneIds[route],
      ...actFiveRouteSceneIds[route],
    ];
    const binaryScenes = routeSceneIds.filter((sceneId) => scenes[sceneId].choices?.length === 2);
    assert.deepEqual(binaryScenes, [...expectedBinaryScenes[route]]);

    for (const sceneId of binaryScenes) {
      const choices = scenes[sceneId].choices ?? [];
      assert.equal(choices[0].next, choices[1].next, `${sceneId} 的两个选项必须汇入同一节点`);
      assert.equal(choices[0].effect, undefined, `${sceneId} 的选项不应改变状态`);
      assert.equal(choices[1].effect, undefined, `${sceneId} 的选项不应改变状态`);
      assert.notEqual(choices[0].result, choices[1].result, `${sceneId} 应提供不同的专属对话`);
    }
  }
});

test("第三幕四条路线保持各自的人物主旨", () => {
  const expectations = [
    ["zhao", "zhaoLesson", "赵黎", "力量"],
    ["ji", "jiPromise", "纪清寒", "至亲"],
    ["su", "suInscription", "苏莹", "蛊不可祭"],
    ["traitor", "traitorKnife", "薛逢", "月白蛊刃"],
  ] as const;
  for (const [route, sceneId, name, phrase] of expectations) {
    const presentation = resolveScenePresentation({ ...chooseRole(), route }, scenes[sceneId]);
    assert.ok(presentation.text.includes(name));
    assert.ok(presentation.text.includes(phrase));
  }
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
  const shadow = resolveScenePresentation({ ...chooseRole(), route: "traitor" }, scenes.traitorTrail);
  assert.equal(shadow.beats[0]?.background, "background.control-room");
});

test("第四、五幕四条路线各自拥有六个高潮节点与两个收束节点", () => {
  assert.equal(new Set(Object.values(actFourRouteSceneIds).flat()).size, 24);
  assert.equal(new Set(Object.values(actFiveRouteSceneIds).flat()).size, 8);
  for (const route of ["zhao", "ji", "su", "traitor"] as const) {
    actFourRouteSceneIds[route].forEach((sceneId, index) => {
      const scene = scenes[sceneId];
      assert.ok(scene, `${route} 缺少第四幕场景 ${sceneId}`);
      assert.equal(scene.act, 4);
      assert.equal(scene.node, index + 1);
      assert.ok(resolveScenePresentation({ ...chooseRole(), route }, scene).beats.length > 0);
    });
    actFiveRouteSceneIds[route].forEach((sceneId, index) => {
      const scene = scenes[sceneId];
      assert.ok(scene, `${route} 缺少第五幕场景 ${sceneId}`);
      assert.equal(scene.act, 5);
      assert.equal(scene.node, index + 1);
      assert.ok(resolveScenePresentation({ ...chooseRole(), route }, scene).beats.length > 0);
    });
  }
  for (const removed of ["bloodGuard", "bloodRoom", "awakening", "finale", "masterBattle", "zhaoBattle", "qiaoReveal", "qiaoBattle"]) {
    assert.equal(scenes[removed], undefined, `${removed} 旧公共高潮仍未移除`);
  }
});

test("四条路线从第三幕结束后不再重新汇合", () => {
  for (const route of ["zhao", "ji", "su", "traitor"] as const) {
    const actThreeLast = scenes[actThreeRouteSceneIds[route][3]];
    const actFourLast = scenes[actFourRouteSceneIds[route][5]];
    const fixedBattle = typeof actFourLast.battle === "function" ? undefined : actFourLast.battle;
    assert.equal(actThreeLast.choices?.[0]?.next, actFourRouteSceneIds[route][0]);
    assert.equal(actFourLast.choices?.[0]?.next ?? fixedBattle?.victoryNext, actFiveRouteSceneIds[route][0]);
    assert.equal(scenes[actFiveRouteSceneIds[route][0]].choices?.[0]?.next, actFiveRouteSceneIds[route][1]);
    assert.equal(scenes[actFiveRouteSceneIds[route][1]].choices?.[0]?.next, "ending");
  }
});

test("高潮战斗显式声明路线专属的失败结局", () => {
  const battles = ["zhaoBloodGuard", "zhaoDuel", "zhaoQiaoDuel", "jiBloodGuard", "jiQiaoDuel", "suBloodGuard", "suMasterDuel"];
  for (const sceneId of battles) {
    const battle = scenes[sceneId].battle;
    assert.ok(battle && typeof battle !== "function");
    if (!battle || typeof battle === "function") throw new Error(`${sceneId} 缺少固定战斗配置`);
    assert.equal(battle.defeatNext, "ending");
    assert.ok(battle.defeatEnding, `${sceneId} 未声明失败结局`);
  }
});

test("战斗结算使用场景声明的失败结局而非敌人名硬编码", () => {
  const state = { ...chooseRole("healer"), route: "zhao" as const, health: 1 };
  const battle = startBattle(state, scenes.zhaoDuel);
  const defeated = resolveBattleTurn(battle, "blood");
  assert.equal(defeated.sceneId, "ending");
  assert.ok(defeated.flags.includes("结局:deathByZhao"));
  assert.equal(resolveEnding(defeated), "deathByZhao");
});

test("终局背景与每个结局的视觉舞台资源均已登记", () => {
  const formalBackgrounds = [
    ["background.blood-chamber", "/backgrounds/blood-chamber-v1.webp"],
    ["background.dawn-exit", "/backgrounds/dawn-exit-v1.webp"],
    ["background.blood-ruin", "/backgrounds/blood-ruin-v1.webp"],
  ] as const;
  for (const [key, src] of formalBackgrounds) {
    const asset = getVisualAsset(key);
    assert.equal(asset.kind, "image");
    if (asset.kind === "image") assert.equal(asset.src, src);
  }
  for (const ending of Object.values(endings)) {
    assert.equal(getVisualAsset(ending.background).kind, "image", `${ending.id} 未使用正式结局背景`);
  }
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
  if (background.kind === "image") assert.equal(background.src, "/backgrounds/tomb-gate-v1.webp");
});

test("大雾节点的四种人格分别锁定四条固定路线", () => {
  for (const route of ["zhao", "ji", "su", "traitor"] as const) {
    const choice = scenes.fog.choices?.find((item) => item.effect?.route === route);
    assert.ok(choice);
    const next = applyChoice(chooseRole(), choice);
    assert.equal(next.route, route);
    assert.equal(next.routeLocked, true);
  }
});

test("大雾节点在人格唯一领先时只展示对应行动", () => {
  const state = { ...chooseRole(), personality: { power: 3, compassion: 1, insight: 0, scheme: 0 } };
  const choices = resolveScenePresentation(state, scenes.fog).choices;
  assert.deepEqual(choices.map((choice) => choice.id), ["fog-power"]);
  const next = applyChoice(state, choices[0]);
  assert.equal(next.route, "zhao");
  assert.equal(next.routeLocked, true);
});

test("大雾节点在人格并列时展示多个确认行动", () => {
  const state = { ...chooseRole(), personality: { power: 2, compassion: 0, insight: 2, scheme: 1 } };
  const choices = resolveScenePresentation(state, scenes.fog).choices;
  assert.deepEqual(choices.map((choice) => choice.id), ["fog-power", "fog-insight"]);
  assert.ok(choices.every((choice) => canChoose(state, choice)));
});

test("权谋人格经薛逢切入乔无咎叛徒暗线", () => {
  const state = { ...chooseRole(), personality: { power: 0, compassion: 0, insight: 0, scheme: 4 } };
  const [choice] = resolveScenePresentation(state, scenes.fog).choices;
  assert.ok(choice);
  assert.equal(choice.id, "fog-scheme");
  assert.equal(choice.next, "traitorTrail");
  const next = applyChoice(state, choice);
  assert.equal(next.route, "traitor");
  assert.equal(next.routeLocked, true);
});

test("第一、二幕选项统一累积隐藏人格而不再改动好感度", () => {
  for (const sceneId of ["gate", "swarm", "shadow", "chamber", "illusion"] as const) {
    const choices = scenes[sceneId].choices ?? [];
    assert.equal(choices.length, 4, `${sceneId} 应提供四种人格行动`);
    for (const choice of choices) {
      assert.ok(choice.effect?.personality, `${choice.id} 未累积人格`);
      assert.equal("trust" in (choice.effect ?? {}), false, `${choice.id} 仍在改动好感度`);
    }
  }
});

test("四种人格行动对所有主角可见且正确累计对应分数", () => {
  for (const roleId of ["healer", "swordsman", "heir"] as const) {
    assert.equal(resolveScenePresentation(chooseRole(roleId), scenes.gate).choices.length, 4);
  }
  const choice = scenes.gate.choices?.find((item) => item.id === "gate-scheme");
  assert.ok(choice);
  const next = applyChoice(chooseRole("healer"), choice);
  assert.equal(next.personality.scheme, 1);
  assert.ok(next.flags.includes("识破棋局"));
});

test("苏莹线固定推进会补齐血钥与存活事实", () => {
  const choice = scenes.suLineage.choices?.find((item) => item.id === "su-share-burden");
  assert.ok(choice);
  const next = applyChoice({ ...chooseRole(), route: "su", routeLocked: true }, choice);
  assert.ok(next.flags.includes("苏莹存活"));
  assert.ok(next.flags.includes("苏氏血钥"));
  assert.equal(next.sceneId, "suThreshold");
});

test("观察苏莹挑蛊后随机获得一种蛊（血甲蛊或血刃蛊），result 写明所得蛊", () => {
  const choice = scenes.chamber.choices?.find((item) => item.id === "chamber-insight");
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

test("赵黎线固定以冰寒蛊简进入专属决战", () => {
  const choice = scenes.zhaoAwakening.choices?.[0];
  assert.ok(choice);
  const state = { ...chooseRole(), route: "zhao" as const, flags: ["冰寒蛊简"] };
  const next = applyChoice(state, choice);
  assert.equal(next.sceneId, "zhaoDuel");
  assert.equal(startBattle(next, scenes.zhaoDuel).battle?.enemyName, "赵黎");
});

test("真结局路线的墓主战可正常开启，敌方血量仍隐性显示", () => {
  const state = { ...chooseRole(), route: "su" as const, flags: ["苏莹存活"] };
  const battle = startBattle(state, scenes.suMasterDuel);
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
});
