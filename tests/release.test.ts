import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { visualAssetManifest } from "../lib/xue-gu-yin/assets.ts";
import { chooseRole, endingAccess, endings, resolveEnding, scenes } from "../lib/xue-gu-yin/game.ts";
import { canonicalReleasePaths, releaseMeta, validateCanonicalPaths, validateEndingAccess, validateStoryGraph } from "../lib/xue-gu-yin/release.ts";
import { createSaveSlot, isSaveSlot, normalizeSaveSlots, restoreSaveSlot, SAVE_SLOT_COUNT } from "../lib/xue-gu-yin/save.ts";

const probeStates = ["healer", "swordsman", "heir"].map((role) => chooseRole(role as "healer" | "swordsman" | "heir"));

test("发布版本使用预发布语义版本号", () => {
  assert.match(releaseMeta.version, /^\d+\.\d+\.\d+-rc\.\d+$/);
  const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as { version: string };
  assert.equal(packageJson.version, releaseMeta.version);
});

test("全部场景可从墓门抵达且没有悬空跳转", () => {
  assert.deepEqual(validateStoryGraph(scenes, probeStates), []);
});

test("四条正式分线发布基准路线保持首尾连通", () => {
  assert.equal(Object.keys(canonicalReleasePaths).length, 4);
  assert.deepEqual(validateCanonicalPaths(scenes, probeStates), []);
});

test("三个身份的结局图鉴没有无效引用", () => {
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

test("发布资源均存在且满足单文件与总体积预算", () => {
  const sources = [...new Set(Object.values(visualAssetManifest).flatMap((asset) => asset.kind === "image" ? [asset.src] : []))];
  let total = 0;
  for (const source of sources) {
    const file = path.join(process.cwd(), "public", source.replace(/^\//, ""));
    assert.equal(existsSync(file), true, `${source} 不存在`);
    const bytes = statSync(file).size;
    total += bytes;
    assert.ok(bytes <= 600_000, `${source} 超过 600 KB：${bytes}`);
  }
  assert.ok(total <= 4_500_000, `视觉资源总量超过 4.5 MB：${total}`);
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

test("分线后使用自然推进且战斗复用视觉小说舞台", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  const game = readFileSync(path.join(process.cwd(), "features", "xue-gu-yin", "XueGuYinGame.tsx"), "utf8");

  assert.match(game, /linearRouteChoice/);
  assert.match(game, /function BattleStageActor/);
  assert.match(game, /battleActor=\{battle && !battleResult/);
  assert.match(css, /\.vn-battle-actor-layer/);
  assert.match(css, /@keyframes vn-battle-recoil/);
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
  assert.match(css, /\.story-frame\.is-battling \.intent-copy,[\s\S]*bottom:\s*var\(--vn-utility-clearance\)/);
});
