import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { battleCharacterStateAssets, combatActionEffectAssets, endingCgAssets, enemyCombatEffectAsset, formalVisualAssetManifest, visualAssetManifest, type CombatEffectAssetKey } from "../lib/xue-gu-yin/assets.ts";
import { audioAssetManifest } from "../lib/xue-gu-yin/audio.ts";
import { chooseRole, endingAccess, endings, resolveEnding, resolveScenePresentation, scenes, storyMeta } from "../lib/xue-gu-yin/game.ts";
import { canonicalReleasePaths, releaseMeta, validateCanonicalPaths, validateEndingAccess, validateStoryGraph } from "../lib/xue-gu-yin/release.ts";
import { createSaveSlot, isSaveSlot, normalizeSaveSlots, restoreSaveSlot, SAVE_SLOT_COUNT } from "../lib/xue-gu-yin/save.ts";

const probeStates = ["healer", "swordsman", "heir"].map((role) => chooseRole(role as "healer" | "swordsman" | "heir"));

test("发布版本使用预发布语义版本号", () => {
  assert.match(releaseMeta.version, /^\d+\.\d+\.\d+-rc\.\d+$/);
  const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as { version: string };
  assert.equal(packageJson.version, releaseMeta.version);
});

test("发布清单与代码标题、版本、路线和结局数量一致", () => {
  const checklist = readFileSync(path.join(process.cwd(), "docs", "RELEASE-CHECKLIST.md"), "utf8");
  assert.ok(checklist.includes(`# 《${storyMeta.title}》发布检查清单`));
  assert.ok(checklist.includes(`当前候选版本：\`${releaseMeta.version}\``));
  assert.equal(Object.keys(canonicalReleasePaths).length, 4);
  assert.ok(checklist.includes("四条正式路线"));
  assert.equal(Object.keys(endings).length, 9);
  assert.ok(checklist.includes("九个登记结局"));
  assert.doesNotMatch(checklist, /血蛊醒|六条基准路径/);
});

test("全部场景可从墓门抵达且没有悬空跳转", () => {
  assert.deepEqual(validateStoryGraph(scenes, probeStates), []);
});

test("四条正式分线发布基准路线保持首尾连通", () => {
  assert.equal(Object.keys(canonicalReleasePaths).length, 4);
  assert.deepEqual(validateCanonicalPaths(scenes, probeStates), []);
});

test("三个身份的结局可达配置没有无效引用", () => {
  assert.deepEqual(validateEndingAccess(Object.keys(endings), endingAccess), []);
});

test("所有结局旗标都能由统一结算器解析", () => {
  for (const endingId of Object.keys(endings)) {
    assert.equal(resolveEnding({ ...chooseRole(), flags: [`结局:${endingId}`] }), endingId);
  }
});

test("手动存档和快速存档共享同一套序列化规则", () => {
  const game = { ...chooseRole("heir"), sceneId: "shadow", health: 7 };
  const slot = createSaveSlot({ game, narrative: { sceneId: "shadow", page: 3 }, now: new Date("2026-08-24T08:00:00.000Z") });
  assert.equal(isSaveSlot(slot), true);
  assert.deepEqual(restoreSaveSlot(slot), { game, narrative: { sceneId: "shadow", page: 3 } });
  assert.equal(normalizeSaveSlots([slot]).length, SAVE_SLOT_COUNT);
  assert.equal(normalizeSaveSlots([slot])[0]?.savedAt, "2026-08-24T08:00:00.000Z");
});

test("战斗结算待确认时保存结算后的场景并重置分页", () => {
  const game = { ...chooseRole("swordsman"), sceneId: "puppets" };
  const pendingGame = { ...game, sceneId: "fog", battle: null };
  const slot = createSaveSlot({ game, pendingGame, narrative: { sceneId: "puppets", page: 5 } });
  assert.equal(slot.game.sceneId, "fog");
  assert.deepEqual(slot.narrative, { sceneId: "fog", page: 0 });
});

test("读取存档会清除旧结局并修正错位叙事页", () => {
  const game = { ...chooseRole("healer"), sceneId: "fog", endingId: "trapped" };
  const slot = createSaveSlot({ game, narrative: { sceneId: "fog", page: 2 } });
  const restored = restoreSaveSlot({ ...slot, narrative: { sceneId: "gate", page: 99 } });
  assert.equal(restored.game.endingId, null);
  assert.deepEqual(restored.narrative, { sceneId: "fog", page: 0 });
});

test("损坏或旧格式存档不会进入六个有效槽位", () => {
  assert.equal(isSaveSlot({ version: 1 }), false);
  assert.equal(isSaveSlot({ version: 2 }), false);
  assert.equal(isSaveSlot({ version: 3 }), false);
  assert.equal(isSaveSlot({ version: 4 }), false);
  assert.equal(isSaveSlot({ version: 5 }), false);
  assert.deepEqual(normalizeSaveSlots("bad"), Array.from({ length: SAVE_SLOT_COUNT }, () => null));
});

test("发布视觉资源均为正式图片且满足单文件与总体积预算", () => {
  for (const [key, asset] of Object.entries(visualAssetManifest)) {
    assert.equal(asset.kind, "image", `${key} 仍在使用开发期 CSS 占位资源`);
  }
  const sources = [...new Set(Object.values(visualAssetManifest).flatMap((asset) => asset.kind === "image" ? [asset.src] : []))];
  let total = 0;
  for (const source of sources) {
    const file = path.join(process.cwd(), "public", source.replace(/^\//, ""));
    assert.equal(existsSync(file), true, `${source} 不存在`);
    const bytes = statSync(file).size;
    total += bytes;
    assert.ok(bytes <= 600_000, `${source} 超过 600 KB：${bytes}`);
  }
  assert.ok(total <= 5_250_000, `视觉资源总量超过 5.25 MB：${total}`);
});

test("美术扩展合同完整枚举 30 张角色、16 张 CG、3 张界面和 7 张特效", () => {
  const assets = Object.values(formalVisualAssetManifest);
  const count = (category: string) => assets.filter((asset) => asset.category === category).length;

  assert.equal(assets.length, 56);
  assert.equal(count("character"), 30);
  assert.equal(count("cg"), 16);
  assert.equal(count("ui"), 3);
  assert.equal(count("effect"), 7);
  assert.equal(new Set(assets.map((asset) => asset.key)).size, assets.length);
  assert.equal(new Set(assets.map((asset) => asset.src)).size, assets.length);

  for (const asset of assets) {
    assert.equal(asset.kind, "image");
    assert.match(asset.src, /^\/[a-z0-9/]+(?:[A-Z][A-Za-z0-9]*)?(?:-[a-z0-9]+)*-v1\.webp$/);
    assert.doesNotMatch(`${asset.key} ${asset.src} ${asset.alt}`, /placeholder|temp|TODO|test|screenshot/i);
    assert.ok(asset.alt.length > 0, `${asset.key} 缺少中文替代文本`);
    assert.ok(asset.purpose.length > 0, `${asset.key} 缺少用途说明`);
    assert.ok(asset.trigger.length > 0, `${asset.key} 缺少运行时触发点`);
  }
});

test("六名角色的 30 个正式状态均有剧情或人形敌手战斗触发", () => {
  const triggered = new Set<string>();
  const routeForScene = (sceneId: string) => {
    if (sceneId.startsWith("zhao")) return "zhao" as const;
    if (sceneId.startsWith("ji")) return "ji" as const;
    if (sceneId.startsWith("su")) return "su" as const;
    if (sceneId.startsWith("traitor")) return "traitor" as const;
    return null;
  };

  for (const [sceneId, scene] of Object.entries(scenes)) {
    for (const roleId of ["healer", "swordsman", "heir"] as const) {
      const route = routeForScene(sceneId);
      const game = {
        ...chooseRole(roleId),
        sceneId,
        route,
        routeLocked: route !== null,
        flags: ["血刃蛊", "血甲蛊", "血魔蛊", "傀儡已毁", "纪清寒线血傀儡已毁", "苏莹线血傀儡已毁", "赵黎线血傀儡已毁"],
      };
      const presentation = resolveScenePresentation(game, scene);
      for (const beat of presentation.beats) {
        for (const character of beat.characters) triggered.add(character.asset);
      }
    }
  }

  for (const actor of Object.values(battleCharacterStateAssets)) {
    triggered.add(actor.battle);
    triggered.add(actor.injured);
  }

  const required = Object.values(formalVisualAssetManifest)
    .filter((asset) => asset.category === "character")
    .map((asset) => asset.key);
  assert.equal(required.length, 30);
  assert.deepEqual(required.filter((key) => !triggered.has(key)), []);
});

test("九个结局各自映射并展示唯一正式 CG", () => {
  assert.deepEqual(Object.keys(endingCgAssets), Object.keys(endings));
  assert.equal(new Set(Object.values(endingCgAssets)).size, 9);

  for (const [endingId, key] of Object.entries(endingCgAssets)) {
    const asset = formalVisualAssetManifest[key];
    assert.equal(asset.category, "cg");
    assert.equal(asset.trigger, `endingId:${endingId}`);
    assert.equal(asset.width, 1600);
    assert.equal(asset.height, 900);
    assert.equal(existsSync(path.join(process.cwd(), "public", asset.src.replace(/^\//, ""))), true, `${asset.src} 不存在`);
  }

  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");
  assert.match(game, /getEndingCgAsset\(ending\.id\)/);
  assert.match(game, /data-asset-key=\{endingCg\.key\}/);
});

test("七个剧情 CG 使用独立全屏层并在淡出后回到无人背景", () => {
  const sceneAssets = {
    gate: ["cg.scene.gate", "background.gate-empty"],
    bloodThreshold: ["cg.scene.bloodThreshold", "background.blood-threshold-empty"],
    fog: ["cg.scene.fog", "background.fog-junction-empty"],
    zhaoAwakening: ["cg.scene.zhaoAwakening", "background.blood-awakening-empty"],
    jiDestroyGu: ["cg.scene.jiDestroyGu", "background.shattered-gu-empty"],
    suCoffin: ["cg.scene.suCoffin", "background.empty-coffin"],
    traitorBloodTaken: ["cg.scene.traitorBloodTaken", "background.blood-transfer-empty"],
  } as const;

  for (const [sceneId, [cg, background]] of Object.entries(sceneAssets)) {
    const presentation = resolveScenePresentation(chooseRole(), scenes[sceneId]);
    assert.equal(presentation.sceneCg, cg);
    assert.equal(presentation.background, background);
    const backgroundAsset = visualAssetManifest[background];
    assert.equal(backgroundAsset.kind, "image");
    const file = path.join(process.cwd(), "public", backgroundAsset.src.replace(/^\//, ""));
    assert.equal(existsSync(file), true, `${backgroundAsset.src} 不存在`);
    assert.ok(statSync(file).size <= 300_000, `${backgroundAsset.src} 超过 300 KB`);
  }

  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");
  assert.match(game, /function SceneCgOverlay/);
  assert.match(game, /className={`vn-scene-cg/);
  assert.match(game, /dismissSceneCg/);
});

test("六类玩家蛊术和敌方反击均映射到独立正式位图特效", () => {
  assert.deepEqual(Object.keys(combatActionEffectAssets), ["blood", "armor", "heal", "sword", "charm", "blooddemon"]);
  const effectKeys: CombatEffectAssetKey[] = [...Object.values(combatActionEffectAssets), enemyCombatEffectAsset];
  assert.equal(new Set(effectKeys).size, 7);

  for (const key of effectKeys) {
    const asset = formalVisualAssetManifest[key];
    assert.equal(asset.category, "effect");
    assert.equal(asset.alpha, true);
    assert.equal(asset.width, 768);
    assert.equal(asset.height, 768);
    assert.equal(existsSync(path.join(process.cwd(), "public", asset.src.replace(/^\//, ""))), true, `${asset.src} 不存在`);
  }
});

test("原创本地音频均可读取且满足单文件与总体积预算", () => {
  let total = 0;
  for (const [key, asset] of Object.entries(audioAssetManifest)) {
    const file = path.join(process.cwd(), "public", asset.src.replace(/^\//, ""));
    assert.equal(existsSync(file), true, `${asset.src} 不存在`);
    const bytes = statSync(file).size;
    total += bytes;
    assert.ok(bytes <= 600_000, `${asset.src} 超过 600 KB：${bytes}`);
    const header = readFileSync(file).subarray(0, 12);
    assert.equal(header.subarray(0, 4).toString("ascii"), "RIFF", `${asset.src} 缺少 RIFF 文件头`);
    assert.equal(header.subarray(8, 12).toString("ascii"), "WAVE", `${asset.src} 缺少 WAVE 文件头`);
    const wave = readFileSync(file);
    assert.equal(wave.readUInt16LE(20), 1, `${asset.src} 必须使用 PCM 编码`);
    assert.equal(wave.readUInt16LE(22), 1, `${asset.src} 必须使用单声道以控制体积`);
    assert.equal(wave.readUInt32LE(24), 22_050, `${asset.src} 的采样率不一致`);
    assert.equal(wave.readUInt16LE(34), 16, `${asset.src} 必须使用 16 位采样`);
    const sampleCount = (wave.length - 44) / 2;
    let peak = 0;
    let squareSum = 0;
    for (let offset = 44; offset < wave.length; offset += 2) {
      const sample = wave.readInt16LE(offset);
      peak = Math.max(peak, Math.abs(sample));
      squareSum += sample * sample;
    }
    const duration = sampleCount / 22_050;
    const rms = Math.sqrt(squareSum / sampleCount);
    assert.ok(peak >= 4_000 && peak < 32_000, `${asset.src} 的峰值异常：${peak}`);
    assert.ok(rms >= 1_000 && rms <= 12_000, `${asset.src} 的 RMS 异常：${rms}`);
    assert.ok(asset.loop ? duration >= 8 : duration < 1, `${asset.src} 的时长与循环属性不一致：${duration}`);
    assert.equal(asset.channel === "sfx", !asset.loop, `${key} 的循环属性与声道不一致`);
    assert.ok(asset.fallback, `${key} 缺少加载失败回退`);
  }
  assert.ok(total <= 2_600_000, `音频资源总量超过 2.6 MB：${total}`);
});

test("主菜单、设置与存档页各自引用独立正式主视觉且不再引用旧占位文件", () => {
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");
  assert.match(game, /ViewArtwork assetKey="ui\.main-menu"/);
  assert.match(game, /ViewArtwork assetKey="ui\.settings"/);
  assert.match(game, /ViewArtwork assetKey="ui\.saves"/);
  assert.doesNotMatch(game, /ji-qinghan-placeholder\.webp/);
});

test("手机端使用横屏视觉小说舞台并在竖屏提示旋转", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const page = readFileSync(path.join(process.cwd(), "app", "page.tsx"), "utf8");
  const layout = readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.match(css, /@media\s*\(orientation:\s*landscape\)\s*and\s*\(max-width:\s*59\.99rem\)/);
  assert.doesNotMatch(css, /orientation:\s*landscape[\s\S]{0,80}min-width:\s*35rem/);
  assert.match(css, /orientation:\s*portrait[\s\S]*max-width:\s*48rem/);
  assert.match(page, /className="orientation-prompt"/);
  assert.match(page, /请旋转设备/);
  assert.match(layout, /viewportFit:\s*"cover"/);
  assert.match(game, /isCompactLandscape/);
});

test("主页结局图鉴在固定视口内提供独立纵向滚动", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.match(css, /\.archive-card:not\(\.save-archive\) \.ending-list\s*\{[\s\S]*?overflow-y:\s*auto;/);
  assert.match(css, /\.archive-card:not\(\.save-archive\) \.ending-list::\-webkit-scrollbar-thumb/);
  assert.doesNotMatch(game, /archiveRoleId|onSelectRole|className="archive-tabs"/);
  assert.match(game, /const endingEntries = Object\.values\(endings\)/);
  assert.match(game, /已收录的命数/);
  assert.doesNotMatch(game, /此身份无法抵达|换一位修士/);
});

test("分线后使用自然推进且战斗复用视觉小说舞台", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.match(game, /linearRouteChoice/);
  assert.match(game, /function BattleStageActor/);
  assert.match(game, /function BattleScene/);
  assert.match(game, /battleActor=\{battle && \(!battleResult \|\| battleResult\.won\)/);
  assert.match(game, /className="status-bar battle-status-bar"/);
  assert.match(game, /className="choice-panel battle-choice-panel"/);
  assert.match(game, /<small>{action\.description}<\/small>/);
  assert.match(game, /const cost = actionCost\(action\.id\)/);
  assert.match(game, /`消耗 \$\{cost\} 真元`/);
  assert.match(game, /className=\{lacksEssence \? "is-insufficient" : ""\}/);
  assert.match(game, /className="battle-essence"[\s\S]*?<i style=/);
  assert.match(game, /<small>状态<\/small>{enemyCondition}/);
  assert.doesNotMatch(game, /敌方异动|敌方状态：/);
  assert.match(game, /const immune = action === "charm"/);
  assert.match(game, /最后一击贯穿铜皮傀儡胸前的蛊核/);
  assert.doesNotMatch(game, /这一战，终究是你笑到了最后/);
  assert.doesNotMatch(game, /<section className="battle-panel"/);
  assert.match(css, /\.vn-battle-actor-layer/);
  assert.match(css, /\.story-frame\.is-battling \.battle-choice-panel \{[\s\S]*?right: 5vw;[\s\S]*?grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(css, /\.story-frame\.is-battling \.vn-battle-actor \{[\s\S]*?left: 3vw;/);
  assert.match(css, /@keyframes vn-battle-recoil/);
  assert.match(css, /@keyframes vn-battle-defeated[\s\S]*?opacity:\s*0;[\s\S]*?transform:/);
  assert.match(css, /\.vn-battle-actor-layer\.is-defeated \.vn-battle-actor/);
  assert.match(css, /prefers-reduced-motion:[\s\S]*?vn-battle-defeated-reduced/);
  assert.doesNotMatch(game, /const savers: Record<PersonalityId, string>/);
  assert.match(css, /battle remains inside the visual-novel stage/);
});

test("对话推进只显示无边框箭头，不再渲染继续按钮", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.doesNotMatch(game, />\s*继续\s*<\/button>/);
  assert.match(game, /className="vn-continue-indicator"[^>]*>⌄<\/span>/);
  assert.match(css, /\.vn-continue-indicator\s*\{[\s\S]*?border:\s*0;/);
  assert.match(css, /\.vn-continue-indicator\s*\{[\s\S]*?pointer-events:\s*none;/);
});

test("快捷功能栏始终占用独立底部安全区", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.doesNotMatch(game, /!battle\s*\?\s*<QuickMenu/);
  assert.match(game, /<QuickMenu autoMode=\{autoMode\}/);
  assert.match(css, /reserve a dedicated bottom utility lane/);
  assert.match(css, /--vn-utility-clearance:/);
  assert.match(css, /\.vn-story-core \.scene\s*\{\s*bottom:\s*var\(--vn-utility-clearance\)/);
  assert.match(css, /\.story-frame\.is-battling \.vn-story-core \.battle-scene\s*\{[\s\S]*?bottom:\s*var\(--vn-utility-clearance\)/);
});

test("手机端可点按高速快进全部剧情且立绘避开顶部安全区", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.match(game, /onSkip=\{\(\) => setSkipMode\(\(current\) => !current\)\}/);
  assert.match(game, /<button aria-pressed=\{skipMode\}[\s\S]*?onClick=\{onSkip\}>快进/);
  assert.doesNotMatch(game, /<span className=\{skipMode \? "is-active" : ""\}>快进/);
  assert.match(game, /if \(!canAdvance \|\| \(!autoMode && !skipMode\)\) return;/);
  assert.match(game, /const delay = skipMode \? 90 : autoAdvanceDelay\(text\);/);
  assert.doesNotMatch(game, /currentRead/);
  assert.match(css, /--vn-character-top-clearance:[\s\S]*?env\(safe-area-inset-top\)/);
  assert.match(css, /\.vn-character-slot,[\s\S]*?height:\s*min\(76dvh, calc\(100dvh - var\(--vn-character-top-clearance\)\)\)/);
});

test("Android 外壳锁定横屏并仅通过 HTTPS 加载游戏", () => {
  const manifest = readFileSync(path.join(process.cwd(), "android", "app", "src", "main", "AndroidManifest.xml"), "utf8");
  const activity = readFileSync(path.join(process.cwd(), "android", "app", "src", "main", "java", "top", "xcymm3", "adv", "MainActivity.java"), "utf8");
  const gradle = readFileSync(path.join(process.cwd(), "android", "app", "build.gradle.kts"), "utf8");

  assert.match(manifest, /android\.permission\.INTERNET/);
  assert.match(manifest, /android:screenOrientation="sensorLandscape"/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
  assert.match(activity, /HOME_URL = "https:\/\/adv\.xcymm3\.top\/"/);
  assert.match(activity, /setDomStorageEnabled\(true\)/);
  assert.match(activity, /WindowInsetsController\.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE/);
  assert.match(activity, /getOnBackPressedDispatcher\(\)\.addCallback/);
  assert.doesNotMatch(activity, /public void onBackPressed\(\)/);
  assert.match(gradle, /targetSdk = 36/);
});
