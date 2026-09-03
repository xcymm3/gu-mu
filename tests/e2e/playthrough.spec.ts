import { expect, test as base, type Locator, type Page } from "@playwright/test";

import { chooseRole } from "../../lib/xue-gu-yin/game";
import { createSaveSlot } from "../../lib/xue-gu-yin/save";

type BrowserDiagnostics = {
  failures: string[];
};

type Fixtures = {
  browserDiagnostics: BrowserDiagnostics;
};

const saveStorageKey = "xue-gu-yin-save-slots-v2";

const test = base.extend<Fixtures>({
  browserDiagnostics: async ({ page }, runFixture) => {
    const diagnostics: BrowserDiagnostics = { failures: [] };

    page.on("pageerror", (error) => {
      diagnostics.failures.push(`pageerror: ${error.message}`);
    });
    page.on("console", (message) => {
      if (message.type() === "error") {
        diagnostics.failures.push(`console.error: ${message.text()}`);
      }
    });
    page.on("requestfailed", (request) => {
      diagnostics.failures.push(
        `requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown"})`,
      );
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        diagnostics.failures.push(
          `response: ${response.status()} ${response.request().method()} ${response.url()}`,
        );
      }
    });

    await runFixture(diagnostics);

    expect.soft(diagnostics.failures, "浏览器运行时不应出现错误或失败资源请求").toEqual([]);
  },
});

async function openCleanGame(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
}

async function expectNoGlobalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth, `页面横向溢出：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(
    dimensions.innerWidth,
  );
  expect(dimensions.scrollHeight, `页面纵向溢出：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(
    dimensions.innerHeight,
  );
}

async function advanceUntilVisible(page: Page, target: Locator, label: string, limit = 160) {
  const stage = page.getByLabel("血蛊引游戏界面");

  for (let attempt = 0; attempt < limit; attempt += 1) {
    if (await target.isVisible()) return;
    await stage.click({ position: { x: 8, y: 8 } });
  }

  throw new Error(`推进 ${limit} 次后仍未出现：${label}`);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
});

test("七个剧情 CG 显示对应章节标题并可返回无人背景", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  const cases = [
    { sceneId: "gate", route: null, asset: "cg.scene.gate", chapter: "1-1", title: "夜雨墓门", background: "background.gate-empty" },
    { sceneId: "bloodThreshold", route: null, asset: "cg.scene.bloodThreshold", chapter: "1-3", title: "血门将合", background: "background.blood-threshold-empty" },
    { sceneId: "fog", route: null, asset: "cg.scene.fog", chapter: "2-7", title: "大雾迷踪", background: "background.fog-junction-empty" },
    { sceneId: "zhaoAwakening", route: "zhao", asset: "cg.scene.zhaoAwakening", chapter: "4-3", title: "五转蛊醒", background: "background.blood-awakening-empty" },
    { sceneId: "jiDestroyGu", route: "ji", asset: "cg.scene.jiDestroyGu", chapter: "4-6", title: "破蛊断脉", background: "background.shattered-gu-empty" },
    { sceneId: "suCoffin", route: "su", asset: "cg.scene.suCoffin", chapter: "4-3", title: "空棺遗文", background: "background.empty-coffin" },
    { sceneId: "traitorBloodTaken", route: "traitor", asset: "cg.scene.traitorBloodTaken", chapter: "4-6", title: "血蛊易主", background: "background.blood-transfer-empty" },
  ] as const;

  await page.goto("/");
  for (const item of cases) {
    const baseGame = chooseRole("swordsman");
    const game = { ...baseGame, sceneId: item.sceneId, route: item.route, routeLocked: item.route !== null };
    const slot = createSaveSlot({ game, narrative: { sceneId: item.sceneId, page: 0 }, now: new Date("2026-09-02T00:00:00.000Z") });
    await page.evaluate(({ key, value }) => {
      window.localStorage.setItem(key, value);
    }, { key: saveStorageKey, value: JSON.stringify([slot, null, null, null, null, null]) });
    await page.reload();
    await page.getByRole("button", { name: /^读取存档/ }).click();
    await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "读取", exact: true }).click();

    const cg = page.locator(`.vn-scene-cg[data-asset-key="${item.asset}"]`);
    await expect(cg).toBeVisible();
    await expect(cg.locator(".vn-scene-cg-title small")).toHaveText(`Chapter ${item.chapter}`);
    await expect(cg.locator(".vn-scene-cg-title strong")).toHaveText(item.title);
    await cg.click();
    await expect(cg).toBeHidden();
    await expect(page.locator(`.vn-stage[data-asset-key="${item.background}"]`)).toBeVisible();
  }
});

test("主菜单到读档工具链均经过玩家公开操作", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  await openCleanGame(page);
  await expect(page.getByRole("button", { name: /^读取存档/ })).toBeVisible();
  await expectNoGlobalOverflow(page);

  await page.getByRole("button", { name: /^游戏设置/ }).click();
  await expect(page.getByRole("heading", { name: "游戏设置" })).toBeVisible();
  await page.getByRole("button", { name: "暗色" }).click();
  await page.getByRole("button", { name: /减少动态/ }).click();
  await expect(page.getByRole("button", { name: /减少动态/ })).toHaveAttribute("aria-pressed", "true");
  await expectNoGlobalOverflow(page);
  await page.getByRole("button", { name: "返回" }).click();

  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await expect(page.getByText("请选择你的身份")).toBeVisible();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  const stage = page.getByLabel("血蛊引游戏界面");
  await expect(stage).toHaveAttribute("data-scene-id", "gate");
  const openingCg = page.locator('.vn-scene-cg[data-asset-key="cg.scene.gate"]');
  await expect(openingCg).toBeVisible();
  await openingCg.click();
  await expect(openingCg).toBeHidden();
  await expect(page.getByLabel("篇章信息")).toContainText("Chapter 1-1");
  await expect(page.getByLabel("篇章信息")).not.toContainText("夜雨墓门");
  await expect(stage).not.toContainText("夜雨墓门");
  await expect(stage.locator(".scene h1")).toHaveCount(0);
  await expect(stage.locator(".narrative-progress")).toHaveCount(0);

  const savedProgress = await stage.getAttribute("data-narrative-page");
  expect(savedProgress).not.toBeNull();

  await expect(page.getByRole("button", { name: /^快存|^快读/ })).toHaveCount(0);
  await page.getByRole("button", { name: /^存读档/ }).click();
  await expect(page.getByRole("heading", { name: "存读档", exact: true })).toBeVisible();
  const firstSlot = page.locator(".save-archive .save-slot").first();
  await firstSlot.getByRole("button", { name: "存入" }).click();
  await expect(firstSlot).toContainText("流浪剑修");
  await expect(firstSlot).toContainText("Chapter 1-1");
  await expect(firstSlot.locator("strong")).toHaveText("夜雨墓门");
  await expect(page.getByRole("status")).toHaveText("已保存至存档 1");
  await page.getByRole("button", { name: "返回", exact: true }).click();

  await stage.click({ position: { x: 8, y: 8 } });
  await expect(stage).not.toHaveAttribute("data-narrative-page", savedProgress!);
  await page.getByRole("button", { name: /^存读档/ }).click();
  await firstSlot.getByRole("button", { name: "读取", exact: true }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await expect(stage).toHaveAttribute("data-narrative-page", savedProgress!);

  await page.getByLabel("血蛊引游戏界面").click({ position: { x: 8, y: 8 } });
  await page.getByRole("button", { name: "打开游戏菜单" }).click();
  await page.getByRole("dialog", { name: "游戏菜单" }).locator(".save-slot").first().getByRole("button", { name: "读取" }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await expect(stage).toHaveAttribute("data-narrative-page", savedProgress!);

  await page.getByLabel("血蛊引游戏界面").click({ position: { x: 8, y: 8 } });
  await page.getByRole("button", { name: /^历史/ }).click();
  const backlog = page.getByRole("dialog", { name: "历史记录" });
  await expect(backlog).toBeVisible();
  await expect(backlog.locator("article")).not.toHaveCount(0);
  await expectNoGlobalOverflow(page);
  await page.getByRole("button", { name: "关闭历史记录" }).click();
});

test("共通线选择可经真实页面推进到首场战斗", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  await openCleanGame(page);
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();

  for (let choiceIndex = 0; choiceIndex < 8; choiceIndex += 1) {
    const firstChoice = page.getByRole("navigation", { name: "剧情选项" }).getByRole("button").first();
    await advanceUntilVisible(page, firstChoice, `共通线第 ${choiceIndex + 1} 次选择`);
    await expectNoGlobalOverflow(page);
    await firstChoice.click();
  }

  const beginBattle = page.getByRole("button", { name: "放出本命蛊" });
  await advanceUntilVisible(page, beginBattle, "首场战斗入口");
  await beginBattle.click();

  const battleActions = page.getByRole("navigation", { name: "选择本回合蛊术" });
  await expect(battleActions).toBeVisible();
  await expect(page.getByText("铜皮傀儡", { exact: true }).first()).toBeVisible();
  await expectNoGlobalOverflow(page);

  await battleActions.getByRole("button", { name: /^血刃蛊/ }).click();
  await battleActions.getByRole("button", { name: /^血刃蛊/ }).click();
  await expect(battleActions).toBeHidden();
  await expect(page.getByText(/最后一击贯穿铜皮傀儡胸前的蛊核/)).toBeVisible();
  await expectNoGlobalOverflow(page);
});
