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

test("游方蛊医的实际可达结局不包含击败苏衍的真结局", () => {
  assert.equal(endingAccess.healer.includes("true"), false);
  assert.equal(endingAccess.swordsman.includes("true"), true);
  assert.equal(endingAccess.heir.includes("true"), true);
});

test("高神识仅世家之子具备", () => {
  assert.equal(chooseRole("healer").flags.includes("高神识"), false);
  assert.equal(chooseRole("swordsman").flags.includes("高神识"), false);
  assert.equal(chooseRole("heir").flags.includes("高神识"), true);
});

test("五幕节点合同固定为共通线三、七与分线四、六、二", () => {
  assert.deepEqual(storyMeta.acts.map((act) => act.nodes), [3, 7, "每线 4", "每线 6", "每线 2"]);
  const counts = [1, 2, 3, 4, 5].map((act) => [...new Set(Object.values(scenes).filter((scene) => scene.act === act).map((scene) => scene.node))]);
  assert.deepEqual(counts[0], [1, 2, 3]);
  assert.deepEqual(counts[1], [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(counts[2], [1, 2, 3, 4]);
  assert.deepEqual(counts[3], [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(counts[4], [1, 2]);
});

test("第一幕三个节点均使用原生阅读事件", () => {
  for (const sceneId of ["gate", "rainMark", "bloodThreshold"] as const) {
    const presentation = resolveScenePresentation(chooseRole(), scenes[sceneId]);
    assert.equal(presentation.background, "background.tomb-gate");
    assert.equal(scenes[sceneId].text, undefined);
    assert.equal(presentation.choices.length, scenes[sceneId].choices?.length);
    assert.ok(presentation.events.some((event) => event.type === "narration"));
    assert.ok(presentation.events.some((event) => event.type === "choice"));
  }
  const gate = resolveScenePresentation(chooseRole(), scenes.gate);
  assert.ok(gate.text.includes("黑风呼啸，暴雨倾盆"));
  assert.ok(gate.text.includes("老夫耗费数载方才查实"));
  assert.ok(!gate.text.includes("**"));
  assert.deepEqual(gate.choices.map((choice) => choice.label), [
    "落后赵黎半步进入石门，暗中观察其血纹蛊",
    "按紧发烫的旧玉，静待墓门蛊纹下一次微光闪烁",
  ]);
  const [gatePowerResult, gateInsightResult] = gate.choices.map((choice) => choice.result ?? "");
  assert.match(gatePowerResult, /少年模样的血修.*本命蛊能压过他一头/s);
  assert.match(gateInsightResult, /苏莹也在同一时刻察觉到了蛊纹的变化.*眼下还无法判断/s);
  assert.doesNotMatch(`${gatePowerResult}${gateInsightResult}`, /赵黎指间的血纹蛊只显露了片刻威势|你没有声张，只把两处异常一并记在心里/);
  const rainMark = resolveScenePresentation(chooseRole(), scenes.rainMark);
  assert.ok(rainMark.text.includes("跨过那道幽暗如墨的石门后"));
  assert.ok(!rainMark.text.includes("远超同阶"));
  assert.deepEqual(rainMark.choices.map((choice) => choice.label), [
    "突然出声喊住薛逢，指明蛊纹下隐藏的剧毒针孔，劝众人贴着石壁边缘绕行",
    "佯装不知，冷眼旁观薛逢踩中机关，借此探明这暗器禁制的具体威力与范围",
  ]);
  const bloodThreshold = resolveScenePresentation(chooseRole(), scenes.bloodThreshold);
  assert.ok(bloodThreshold.text.includes("这道沉闷湿冷的狭长石阶延伸了约莫三四十丈深"));
  assert.ok(bloodThreshold.text.includes("圆脸汉子薛逢以及少女苏莹"));
  assert.doesNotMatch(bloodThreshold.text, /受伤的剑腕|虎口旧伤|嗅到血气|侵蚀着她的气血脉络|瞬间脱轨/);
  assert.deepEqual(bloodThreshold.choices.map((choice) => choice.label), [
    "运转真元，催动本命蛊托住坠落的石闸",
    "放弃硬撑石闸，先震断缠住纪清寒的毒蛊",
  ]);
  const [powerResult, compassionResult] = bloodThreshold.choices.map((choice) => choice.result ?? "");
  assert.doesNotMatch(powerResult, /耗去七八|残存的几只幼蛊/);
  assert.doesNotMatch(compassionResult, /非人力所能硬抗|脱轨|第一道致命死关/);
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

test("第二幕七个固定节点均已迁移为原生阅读事件", () => {
  const actTwoIds = ["swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog"] as const;
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

test("第二幕条件事件会响应前置选择旗标", () => {
  const base = chooseRole();
  const aided = { ...base, flags: [...base.flags, "纪清寒回护"] };
  assert.equal(resolveScenePresentation(base, scenes.puppets).text.includes("墓门前，你替众人省了一场麻烦"), false);
  assert.equal(resolveScenePresentation(aided, scenes.puppets).text.includes("墓门前，你替众人省了一场麻烦"), true);
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
  assert.equal(defeated.health, defeated.maxHealth);
});

test("共通线铜皮傀儡战败后也直接进入死亡结局", () => {
  const battle = startBattle({ ...chooseRole("healer"), health: 1 }, scenes.puppets);
  const defeated = resolveBattleTurn(battle, "blood");
  assert.equal(defeated.sceneId, "ending");
  assert.ok(defeated.flags.includes("结局:deathByBloodGuard"));
  assert.equal(resolveEnding(defeated), "deathByBloodGuard");
});

test("每场战斗结束后无论胜败都会回满生命", () => {
  let victorious = startBattle(chooseRole("swordsman"), scenes.puppets);
  victorious = resolveBattleTurn(victorious, "sword");
  assert.ok(victorious.battle);
  assert.ok(victorious.health < victorious.maxHealth);
  victorious = resolveBattleTurn(victorious, "sword");
  assert.equal(victorious.battle, null);
  assert.equal(victorious.health, victorious.maxHealth);
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

test("铜皮傀儡与血傀儡均从正式透明立绘资源加载", () => {
  const enemies = [
    ["character.enemy.tong-pi-kui-lei", "/characters/tong-pi-kui-lei-v1.webp"],
    ["character.enemy.xue-kui-lei", "/characters/xue-kui-lei-v1.webp"],
  ] as const;
  for (const [key, src] of enemies) {
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

test("共通线八次选择共17项，并按关怀5、力量5、权谋4、洞察3分布", () => {
  const commonChoiceSceneIds = ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge"] as const;
  const choices = commonChoiceSceneIds.flatMap((sceneId) => scenes[sceneId].choices ?? []);
  assert.equal(choices.length, 17);
  assert.deepEqual(commonChoiceSceneIds.map((sceneId) => scenes[sceneId].choices?.length), [2, 2, 2, 2, 2, 3, 2, 2]);

  const totals = { power: 0, compassion: 0, insight: 0, scheme: 0 };
  for (const choice of choices) {
    assert.ok(choice.effect?.personality, `${choice.id} 未累积人格`);
    for (const personality of Object.keys(totals) as Array<keyof typeof totals>) {
      totals[personality] += choice.effect?.personality?.[personality] ?? 0;
    }
    assert.equal("trust" in (choice.effect ?? {}), false, `${choice.id} 仍在改动好感度`);
  }
  assert.deepEqual(totals, { power: 5, compassion: 5, insight: 3, scheme: 4 });
});

test("共通线不保留无用途记录且不过早坐实乔无咎的嫌疑", () => {
  const choiceData = JSON.stringify(Object.values(scenes).flatMap((scene) => scene.choices ?? []));
  for (const record of ["旧玉发烫", "识破棋局", "乔无咎知情", "蛊卵认血", "乔薛有旧"]) {
    assert.equal(choiceData.includes(record), false, `${record} 仍被写入选择记录`);
  }

  const commonText = ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog"]
    .map((sceneId) => resolveScenePresentation(chooseRole(), scenes[sceneId]).text)
    .join("\n");
  assert.doesNotMatch(commonText, /绝不像初次入墓|像在照本宣科|堵住了最像生门|拐入一条连火光都照不进的岔道/);
});

test("所有剧情选择都不再直接恢复当前生命", () => {
  for (const scene of Object.values(scenes)) {
    for (const choice of scene.choices ?? []) {
      assert.equal(choice.effect?.health, undefined, `${choice.id} 仍在恢复当前生命`);
    }
  }
});

test("纪清寒剑意回护与包扎只提升生命上限", () => {
  const wounded = { ...chooseRole("healer"), health: 5 };
  const aided = startBattle({ ...wounded, flags: [...wounded.flags, "纪清寒回护"] }, scenes.puppets);
  assert.equal(aided.maxHealth, wounded.maxHealth + 4);
  assert.equal(aided.health, wounded.health);

  const binding = scenes.jiTrail.choices?.find((choice) => choice.id === "ji-bind-wound");
  assert.ok(binding);
  const bound = applyChoice(wounded, binding);
  assert.equal(bound.maxHealth, wounded.maxHealth + 4);
  assert.equal(bound.health, wounded.health);
});

test("机关暗室关怀选项不强行点名纪清寒", () => {
  const choice = scenes.chamber.choices?.find((item) => item.id === "chamber-compassion");
  assert.ok(choice);
  assert.doesNotMatch(`${choice.label}${choice.result ?? ""}`, /纪清寒/);
});

test("第一、二幕态度选项对所有主角可见", () => {
  for (const sceneId of ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge"] as const) {
    const choices = scenes[sceneId].choices ?? [];
    for (const roleId of ["healer", "swordsman", "heir"] as const) {
      assert.equal(resolveScenePresentation(chooseRole(roleId), scenes[sceneId]).choices.length, choices.length);
    }
  }
});

test("权谋选择会累计分数且不写入无后续用途的记录", () => {
  const choice = scenes.rainMark.choices?.find((item) => item.id === "rain-scheme");
  assert.ok(choice);
  assert.match(choice.label, /佯装不知/);
  assert.match(choice.result ?? "", /纪清寒凌空折返.*剑幕.*毒针尽数击飞/);
  const next = applyChoice(chooseRole("healer"), choice);
  assert.equal(next.personality.scheme, 1);
  assert.deepEqual(next.flags, []);
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
  assert.equal(choice.effect?.flags, undefined);
  // roll=0 → 血甲蛊
  const armor = resolveRandomChoice(choice, () => 0);
  assert.ok(armor.effect?.flags?.includes("血甲蛊"));
  assert.deepEqual(armor.effect?.flags, ["血甲蛊"]);
  assert.ok(armor.result?.includes("甲纹森森"));
  // roll 接近 1 → 血刃蛊
  const blade = resolveRandomChoice(choice, () => 0.99);
  assert.ok(blade.effect?.flags?.includes("血刃蛊"));
  assert.ok(blade.result?.includes("血芒吞吐"));
  // 应用后状态只携带实际取得的随机蛊 flag
  const next = applyChoice(chooseRole(), armor);
  assert.ok(next.flags.includes("血甲蛊") || next.flags.includes("血刃蛊"));
  assert.equal(next.personality.insight, 1);
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
