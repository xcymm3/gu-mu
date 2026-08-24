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

test("六条发布基准路线保持首尾连通", () => {
  assert.equal(Object.keys(canonicalReleasePaths).length, 6);
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
