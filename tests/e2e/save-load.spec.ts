import { expect, test, type Page } from "@playwright/test";
import { chooseRole, scenes, startBattle } from "../../lib/xue-gu-yin/game";
import { createSaveSlot } from "../../lib/xue-gu-yin/save";

const savesKey = "xue-gu-yin-save-slots-v2";
const legacyKey = "xue-gu-yin-quick-save-v1";
const slot = createSaveSlot({ game: chooseRole("swordsman"), narrative: { sceneId: "gate", page: 0, anchor: { beatIndex: 0, offset: 0 } } });

async function dismissCg(page: Page) {
  if (await page.locator(".vn-scene-cg").count()) {
    await page.locator(".vn-scene-cg").click();
    await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  }
}

async function start(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await dismissCg(page);
  await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
}

for (const viewport of [{ width: 1366, height: 768 }, { width: 844, height: 390 }, { width: 667, height: 375 }, { width: 568, height: 320 }]) {
  test(`直接存读档显示章节、覆盖确认并恢复阅读 ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await start(page);
    const text = await page.locator(".scene-copy").innerText();
    await expect(page.getByRole("button", { name: /^快存|^快读/ })).toHaveCount(0);
    await page.keyboard.press("q");
    await page.keyboard.press("l");
    expect(await page.evaluate((key) => localStorage.getItem(key), legacyKey)).toBeNull();
    await page.getByRole("button", { name: /^自动/ }).click();
    await page.getByRole("button", { name: /^存读档/ }).click();
    await expect(page.getByRole("heading", { name: "存读档", exact: true })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "游戏菜单" })).toHaveCount(0);
    const first = page.locator(".save-archive .save-slot").first();
    await expect(first.getByRole("button", { name: "读取", exact: true })).toBeDisabled();
    await first.getByRole("button", { name: "存入", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("已保存至存档 1");
    await expect(first.locator(".save-slot-chapter")).toContainText("Chapter 1-1");
    await expect(first.locator(".save-slot-chapter")).toContainText("第一幕");
    await expect(first.locator("strong")).toHaveText("夜雨墓门");
    await expect(first.locator("small")).toHaveText("流浪剑修");
    await expect(first.locator("small")).toBeVisible();
    await expect(first.locator("time")).toBeVisible();
    const saved = await page.evaluate((key) => localStorage.getItem(key), savesKey);
    await first.getByRole("button", { name: "存入", exact: true }).click();
    await expect(first.getByRole("alert")).toHaveText("覆盖此卷的原有进度？");
    expect(await page.evaluate((key) => localStorage.getItem(key), savesKey)).toBe(saved);
    await first.getByRole("button", { name: "取消", exact: true }).click();
    expect(await page.evaluate((key) => localStorage.getItem(key), savesKey)).toBe(saved);
    expect(await first.evaluate((element) => element.scrollHeight <= element.clientHeight + 1), "存档信息与操作必须完整容纳于卡片内").toBe(true);
    await page.locator(".save-archive-list").evaluate((element) => { element.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath("save-archive.png"), animations: "disabled" });
    // The sixth entry must remain reachable even in a short landscape viewport.
    await page.locator(".save-slot").nth(5).getByRole("button", { name: "存入", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("已保存至存档 6");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: /^自动/ })).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("button", { name: /^快进/ })).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".scene-copy")).toHaveText(text);
    await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
    const laterText = await page.locator(".scene-copy").innerText();
    expect(laterText).not.toBe(text);
    await page.keyboard.press("s");
    await first.getByRole("button", { name: "存入", exact: true }).click();
    await first.getByRole("button", { name: "确认覆盖", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("已保存至存档 1");
    await page.reload();
    await page.getByRole("button", { name: /^读取存档/ }).click();
    await expect(first.getByRole("button", { name: "存入", exact: true })).toHaveCount(0);
    await first.getByRole("button", { name: "读取", exact: true }).click();
    await dismissCg(page);
    await expect(page.locator(".scene-copy")).toHaveText(laterText);
    expect(errors).toEqual([]);
  });
}

test("六个普通槽位满时仍可读取旧版存档且不改动原数据", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(({ slot, savesKey, legacyKey }) => {
    localStorage.setItem(savesKey, JSON.stringify(Array(6).fill(slot)));
    localStorage.setItem(legacyKey, JSON.stringify(slot));
  }, { slot, savesKey, legacyKey });
  await page.reload();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await expect(page.locator(".save-slot")).toHaveCount(7);
  const legacy = page.getByRole("article", { name: "旧版存档", exact: true });
  await expect(legacy).toContainText("夜雨墓门");
  await expect(legacy.getByRole("button", { name: "存入", exact: true })).toHaveCount(0);
  await legacy.getByRole("button", { name: "读取", exact: true }).click();
  await dismissCg(page);
  await expect(page.locator(".story-frame")).toHaveAttribute("data-scene-id", "gate");
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), legacyKey)).toEqual(slot);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), savesKey)).toEqual(Array(6).fill(slot));
});

test("损坏的旧版存档不阻止普通槽位加载", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(({ slot, savesKey, legacyKey }) => {
    localStorage.setItem(savesKey, JSON.stringify([slot]));
    localStorage.setItem(legacyKey, "{invalid-json");
  }, { slot, savesKey, legacyKey });
  await page.reload();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await expect(page.locator(".save-slot")).toHaveCount(6);
  await page.locator(".save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  await dismissCg(page);
  await expect(page.locator(".story-frame")).toHaveAttribute("data-scene-id", "gate");
});

test("存储失败明确提示且不覆盖原档或假报成功", async ({ page }) => {
  await start(page);
  await page.getByRole("button", { name: /^存读档/ }).click();
  const first = page.locator(".save-slot").first();
  await first.getByRole("button", { name: "存入", exact: true }).click();
  const original = await page.evaluate((key) => localStorage.getItem(key), savesKey);
  await page.evaluate((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException("quota", "QuotaExceededError");
      set.call(this, name, value);
    };
  }, savesKey);
  await first.getByRole("button", { name: "存入", exact: true }).click();
  await first.getByRole("button", { name: "确认覆盖", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("保存失败");
  expect(await page.evaluate((key) => localStorage.getItem(key), savesKey)).toBe(original);
  const empty = page.locator(".save-slot").nth(1);
  await empty.getByRole("button", { name: "存入", exact: true }).click();
  await expect(empty).toContainText("空白卷轴");
  await expect(empty.getByRole("button", { name: "读取", exact: true })).toBeDisabled();
});

test("浏览器禁用本地存储时仍可游玩并收到存档失败提示", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await start(page);
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-slot").first().getByRole("button", { name: "存入", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("保存失败");
  await expect(page.locator(".save-slot").first()).toContainText("空白卷轴");
  expect(errors).toEqual([]);
});

test("战斗稳定回合可从直接入口保存并恢复，特效中禁用入口", async ({ page }) => {
  const battleScene = Object.values(scenes).find((scene) => scene.battle)!;
  const game = startBattle({ ...chooseRole("swordsman"), sceneId: battleScene.id }, battleScene);
  const battleSlot = createSaveSlot({ game, narrative: { sceneId: game.sceneId, page: 0 } });
  await page.goto("/");
  await page.evaluate(({ key, slot }) => localStorage.setItem(key, JSON.stringify([slot])), { key: savesKey, slot: battleSlot });
  await page.reload();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await page.locator(".save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  await dismissCg(page);
  const actions = page.getByRole("navigation", { name: "选择本回合蛊术" });
  await expect(actions).toBeVisible();
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-slot").nth(1).getByRole("button", { name: "存入", exact: true }).click();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!)[1], savesKey);
  expect(saved.game.battle).toEqual(game.battle);
  await page.getByRole("button", { name: "返回", exact: true }).click();
  await actions.getByRole("button").first().click();
  await expect(page.getByRole("button", { name: /^存读档/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /^存读档/ })).toBeEnabled();
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-slot").nth(1).getByRole("button", { name: "读取", exact: true }).click();
  await expect(actions).toBeVisible();
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-slot").nth(2).getByRole("button", { name: "存入", exact: true }).click();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!)[2].game, savesKey)).toEqual(game);
});
