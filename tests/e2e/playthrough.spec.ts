import { expect, test as base, type Locator, type Page } from "@playwright/test";

type BrowserDiagnostics = {
  failures: string[];
};

type Fixtures = {
  browserDiagnostics: BrowserDiagnostics;
};

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
  await expect(page.getByLabel("篇章信息")).toContainText("Chapter 1-1");
  await expect(page.getByLabel("篇章信息")).not.toContainText("夜雨墓门");
  await expect(stage).not.toContainText("夜雨墓门");
  await expect(stage.locator(".scene h1")).toHaveCount(0);
  await expect(stage.locator(".narrative-progress")).toHaveCount(0);

  const savedProgress = await stage.getAttribute("data-narrative-page");
  expect(savedProgress).not.toBeNull();

  await page.getByRole("button", { name: /^快存/ }).click();
  await expect(page.getByText("快速存档完成")).toBeVisible();

  await page.getByRole("button", { name: "打开游戏菜单" }).click();
  const gameMenu = page.getByRole("dialog", { name: "游戏菜单" });
  await expect(gameMenu).toBeVisible();
  const firstSlot = gameMenu.locator(".save-slot").first();
  await firstSlot.getByRole("button", { name: "存入" }).click();
  await expect(firstSlot).toContainText("流浪剑修");
  await page.getByRole("button", { name: "关闭游戏菜单" }).click();

  await stage.click({ position: { x: 8, y: 8 } });
  await expect(stage).not.toHaveAttribute("data-narrative-page", savedProgress!);
  await page.getByRole("button", { name: /^快读/ }).click();
  await expect(stage).toHaveAttribute("data-narrative-page", savedProgress!);
  await expect(page.getByText("已读取快速存档")).toBeVisible();

  await page.getByLabel("血蛊引游戏界面").click({ position: { x: 8, y: 8 } });
  await page.getByRole("button", { name: "打开游戏菜单" }).click();
  await firstSlot.getByRole("button", { name: "读取" }).click();
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
