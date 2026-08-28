import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { expect, test as base, type Locator, type Page } from "@playwright/test";

import {
  applyChoice,
  canChoose,
  chooseRole,
  endings,
  resolveBattleTurn,
  resolveEnding,
  resolveRandomChoice,
  resolveScenePresentation,
  scenes,
  startBattle,
  type Choice,
  type GameState,
  type GuAction,
} from "../../lib/xue-gu-yin/game";

type BrowserDiagnostics = { failures: string[] };
type Fixtures = { browserDiagnostics: BrowserDiagnostics };

const baselineDirectory = join(process.cwd(), "tests", "e2e", "visual-baselines");
const desktopViewport = { width: 1366, height: 768 };
const trappedRouteChoices = [
  "gate-power",
  "rain-compassion",
  "threshold-power",
  "swarm-insight",
  "shadow-power",
  "chamber-power",
  "illusion-compassion",
  "bridge-power",
  "fog-trapped",
];
const battleActionOrder: GuAction[] = ["sword", "blood", "armor", "rest"];

const test = base.extend<Fixtures>({
  browserDiagnostics: async ({ page }, runFixture) => {
    const diagnostics: BrowserDiagnostics = { failures: [] };
    page.on("pageerror", (error) => diagnostics.failures.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") diagnostics.failures.push(`console.error: ${message.text()}`);
    });
    page.on("requestfailed", (request) => {
      diagnostics.failures.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) diagnostics.failures.push(`response: ${response.status()} ${response.request().method()} ${response.url()}`);
    });

    await runFixture(diagnostics);
    expect.soft(diagnostics.failures, "视觉基线不应包含页面错误、控制台错误或失败资源请求").toEqual([]);
  },
});

function withResolvedEnding(game: GameState): GameState {
  return game.sceneId === "ending" && !game.endingId
    ? { ...game, endingId: resolveEnding(game) }
    : game;
}

function battleStateKey(game: GameState) {
  return game.battle
    ? [game.health, game.essence, game.battle.enemyHealth, game.battle.turn].join(":")
    : `ended:${game.sceneId}`;
}

function findWinningBattlePlan(game: GameState, maxDepth = 20): GuAction[] | null {
  if (!game.battle) return null;
  const victoryScene = game.battle.victoryNext;
  const queue: Array<{ game: GameState; actions: GuAction[] }> = [{ game, actions: [] }];
  const visited = new Set([battleStateKey(game)]);

  while (queue.length) {
    const current = queue.shift()!;
    if (current.actions.length >= maxDepth) continue;
    for (const action of battleActionOrder) {
      const next = resolveBattleTurn(current.game, action);
      if (next === current.game) continue;
      const actions = [...current.actions, action];
      if (!next.battle) {
        if (next.sceneId === victoryScene) return actions;
        continue;
      }
      const key = battleStateKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ game: next, actions });
    }
  }
  return null;
}

function actionLabel(game: GameState, action: GuAction) {
  if (action === "blood") return game.flags.includes("血刃蛊") ? "血刃蛊" : "月光蛊";
  if (action === "armor") return game.flags.includes("血甲蛊") ? "血甲蛊" : "甲衣蛊";
  if (action === "sword") return "剑鸣蛊";
  return "调息";
}

async function openCleanGame(page: Page, viewport = desktopViewport) {
  await page.setViewportSize(viewport);
  await page.clock.setFixedTime(new Date("2026-08-28T06:30:00.000Z"));
  await page.addInitScript(() => {
    window.localStorage.clear();
    Math.random = () => 0.75;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "血蛊引", exact: true })).toBeVisible();
  await waitForVisuals(page);
}

async function waitForVisuals(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolveImage) => {
          image.addEventListener("load", () => resolveImage(), { once: true });
          image.addEventListener("error", () => resolveImage(), { once: true });
        })));
  });
}

async function capture(page: Page, name: string) {
  await mkdir(baselineDirectory, { recursive: true });
  await waitForVisuals(page);
  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    path: join(baselineDirectory, `${name}-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png`),
  });
}

async function expectNoGlobalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth, `页面横向溢出：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.innerWidth);
  expect(dimensions.scrollHeight, `页面纵向溢出：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.innerHeight);
}

async function expectVisibleControlsInsideViewport(page: Page) {
  const violations = await page.locator("button:visible").evaluateAll((buttons) => buttons.flatMap((button) => {
    if (button.closest(".settings-list, .save-archive-list, .save-slot-list, .vn-backlog-list")) return [];
    const rect = button.getBoundingClientRect();
    const label = button.getAttribute("aria-label") ?? button.textContent?.trim() ?? "button";
    return rect.left < -0.5 || rect.top < -0.5 || rect.right > window.innerWidth + 0.5 || rect.bottom > window.innerHeight + 0.5
      ? [`${label}: ${JSON.stringify({ bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top })}`]
      : [];
  }));
  expect(violations, "所有可见按钮都应位于目标视口内").toEqual([]);
}

async function expectDialogueFits(page: Page) {
  const dialogue = page.locator(".scene-copy:visible");
  if (!await dialogue.count()) return;
  const dimensions = await dialogue.evaluate((element) => ({
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth, `对白横向溢出：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  expect(dimensions.scrollHeight, `对白未正确分页：${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.clientHeight + 1);
}

async function expectTouchTargets(locator: Locator) {
  const undersized = await locator.evaluateAll((elements) => elements.flatMap((element) => {
    const rect = element.getBoundingClientRect();
    const label = element.getAttribute("aria-label") ?? element.textContent?.trim() ?? element.tagName;
    return rect.width < 44 || rect.height < 44
      ? [`${label}: ${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`]
      : [];
  }));
  expect(undersized, "手机横屏核心控件触控区域不得小于 44×44 CSS px").toEqual([]);
}

async function expectTokenContrast(page: Page) {
  const results = await page.evaluate((pairs) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const probe = document.createElement("span");
    document.body.append(probe);

    function tokenColor(token: string) {
      probe.style.color = `var(${token})`;
      const color = getComputedStyle(probe).color;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255] as const;
    }

    function composite(foreground: readonly number[], background: readonly number[]) {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      return [0, 1, 2, 3].map((index) => index === 3
        ? alpha
        : (foreground[index] * foreground[3] + background[index] * background[3] * (1 - foreground[3])) / alpha);
    }

    function luminance(color: readonly number[]) {
      const channels = color.slice(0, 3).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    const checks = pairs.map((pair) => {
      const underlay = tokenColor(pair.underlay);
      const background = composite(tokenColor(pair.background), underlay);
      const foreground = composite(tokenColor(pair.foreground), background);
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      return { ...pair, ratio: (lighter + 0.05) / (darker + 0.05) };
    });
    probe.remove();
    return checks;
  }, [
    { name: "对白正文", foreground: "--color-vn-dialog-muted", background: "--color-vn-dialog", underlay: "--color-vn-sky-bottom", minimum: 4.5 },
    { name: "舞台工具栏", foreground: "--color-vn-chrome-ink", background: "--color-vn-chrome", underlay: "--color-vn-sky-bottom", minimum: 4.5 },
    { name: "结局正文", foreground: "--color-vn-ending-muted", background: "--color-vn-ending-surface", underlay: "--color-void", minimum: 4.5 },
    { name: "主按钮", foreground: "--color-accent-ink", background: "--color-accent", underlay: "--color-paper", minimum: 4.5 },
    { name: "焦点环", foreground: "--color-focus", background: "--color-paper", underlay: "--color-canvas", minimum: 3 },
  ]);
  const failures = results.filter((result) => result.ratio < result.minimum)
    .map((result) => `${result.name}: ${result.ratio.toFixed(2)} < ${result.minimum}`);
  expect(failures, `关键 token 对比度：${JSON.stringify(results)}`).toEqual([]);
}

async function expectLayoutSafe(page: Page) {
  await expectNoGlobalOverflow(page);
  await expectVisibleControlsInsideViewport(page);
  await expectDialogueFits(page);
}

class VisualPlaythrough {
  game: GameState = chooseRole("swordsman");

  constructor(readonly page: Page) {}

  private get stage() {
    return this.page.getByLabel("血蛊引游戏界面");
  }

  private currentChoices(): Choice[] {
    return resolveScenePresentation(this.game, scenes[this.game.sceneId]).choices.filter((choice) => canChoose(this.game, choice));
  }

  async selectRole() {
    await this.page.getByRole("button", { name: /^开始游戏/ }).click();
    await this.page.getByRole("button", { name: /流浪剑修/ }).click();
    await expect(this.page.getByRole("heading", { name: scenes[this.game.sceneId].title, exact: true })).toBeVisible();
  }

  async advanceUntilVisible(target: Locator, label: string, limit = 360) {
    for (let attempt = 0; attempt < limit; attempt += 1) {
      if (await target.isVisible()) return;
      await expectDialogueFits(this.page);
      await this.stage.click({ position: { x: 8, y: 8 } });
    }
    throw new Error(`推进 ${limit} 次后仍未出现：${label}`);
  }

  async revealCurrentChoices() {
    const navigation = this.page.getByRole("navigation", { name: "剧情选项" });
    await this.advanceUntilVisible(navigation.getByRole("button").first(), `${this.game.sceneId} 选项`);
    return navigation;
  }

  async takeChoice(choiceId: string) {
    const rawChoice = this.currentChoices().find((choice) => choice.id === choiceId);
    if (!rawChoice) throw new Error(`场景 ${this.game.sceneId} 找不到选择 ${choiceId}`);
    const choice = resolveRandomChoice(rawChoice, () => 0.75);
    const next = withResolvedEnding(applyChoice(this.game, choice));
    const button = this.page.getByRole("navigation", { name: "剧情选项" }).getByRole("button", { name: rawChoice.label, exact: true });
    await this.advanceUntilVisible(button, `选择 ${choiceId}`);
    await button.click();
    const target = next.endingId
      ? this.page.getByRole("heading", { name: endings[next.endingId].name, exact: true })
      : this.page.getByRole("heading", { name: scenes[next.sceneId].title, exact: true });
    await this.advanceUntilVisible(target, `${choiceId} 的目标`);
    this.game = next;
  }

  async revealMultipleCharacters() {
    const characters = this.page.locator(".vn-character-slot.is-visible");
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (await characters.count() >= 2) return;
      if (await this.page.getByRole("navigation", { name: "剧情选项" }).getByRole("button").first().isVisible()) break;
      await expectDialogueFits(this.page);
      await this.stage.click({ position: { x: 8, y: 8 } });
    }
    expect(await characters.count(), "第一幕应提供可复现的多人同屏基线").toBeGreaterThanOrEqual(2);
  }

  async startFirstBattle() {
    const button = this.page.getByRole("button", { name: "放出本命蛊", exact: true });
    await this.advanceUntilVisible(button, "首场战斗入口");
    await button.click();
    this.game = startBattle(this.game, scenes[this.game.sceneId]);
    await expect(this.page.getByRole("navigation", { name: "选择本回合蛊术" })).toBeVisible();
  }

  async winFirstBattle() {
    const plan = findWinningBattlePlan(this.game);
    expect(plan, "首场战斗应存在公开按钮可执行的胜利序列").not.toBeNull();
    for (const action of plan!) {
      const button = this.page.getByRole("navigation", { name: "选择本回合蛊术" })
        .getByRole("button", { name: new RegExp(`^${actionLabel(this.game, action)}，`) });
      await button.click();
      this.game = resolveBattleTurn(this.game, action);
      await expectDialogueFits(this.page);
    }
    await expect(this.page.getByRole("navigation", { name: "选择本回合蛊术" })).toBeHidden();
    await this.advanceUntilVisible(this.page.getByRole("heading", { name: scenes[this.game.sceneId].title, exact: true }), "首战胜利目标");
  }
}

test("关键界面生成桌面视觉基线并保持布局安全", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(180_000);
  await openCleanGame(page);
  await capture(page, "01-main-menu");
  await expectLayoutSafe(page);

  await page.getByRole("button", { name: /^游戏设置/ }).click();
  await capture(page, "02-settings");
  await expectLayoutSafe(page);
  const settingsList = page.locator(".settings-list");
  const settingsScroll = await settingsList.evaluate((element) => ({ clientHeight: element.clientHeight, overflowY: getComputedStyle(element).overflowY, scrollHeight: element.scrollHeight }));
  expect(settingsScroll.scrollHeight).toBeGreaterThan(settingsScroll.clientHeight);
  expect(settingsScroll.overflowY).toBe("auto");
  await page.getByRole("button", { name: /清除结局记录/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: /清除结局记录/ })).toBeInViewport();
  await page.getByRole("button", { name: "返回", exact: true }).click();

  await page.getByRole("button", { name: /^读取存档/ }).click();
  await capture(page, "03-save-archive");
  await expectLayoutSafe(page);
  await page.getByRole("button", { name: "返回", exact: true }).click();

  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await capture(page, "04-role-selection");
  await expectLayoutSafe(page);
  await page.getByRole("button", { name: "返回主界面", exact: true }).click();

  const run = new VisualPlaythrough(page);
  await run.selectRole();
  await capture(page, "05-dialogue");
  await expectLayoutSafe(page);

  await run.revealMultipleCharacters();
  await capture(page, "06-multiple-characters");
  await expectLayoutSafe(page);

  await run.takeChoice(trappedRouteChoices[0]);
  await page.getByRole("button", { name: "打开游戏菜单", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "游戏菜单" });
  await menu.locator(".save-slot").first().getByRole("button", { name: "存入", exact: true }).click();
  await capture(page, "08-manual-save");
  await expectLayoutSafe(page);
  await page.getByRole("button", { name: "关闭游戏菜单", exact: true }).click();

  await page.getByRole("button", { name: /^历史/ }).click();
  await capture(page, "09-history");
  await expectLayoutSafe(page);
  await page.getByRole("button", { name: "关闭历史记录", exact: true }).click();

  for (const choiceId of trappedRouteChoices.slice(1, 5)) await run.takeChoice(choiceId);
  const threeChoices = await run.revealCurrentChoices();
  await expect(threeChoices.getByRole("button")).toHaveCount(3);
  await capture(page, "07-three-choices");
  await expectLayoutSafe(page);

  await run.takeChoice(trappedRouteChoices[5]);
  for (const choiceId of trappedRouteChoices.slice(6, -1)) await run.takeChoice(choiceId);
  await run.startFirstBattle();
  await capture(page, "10-battle");
  await expectLayoutSafe(page);
  await run.winFirstBattle();
  await run.takeChoice(trappedRouteChoices.at(-1)!);
  await capture(page, "11-ending");
  await expectLayoutSafe(page);
});

test("桌面边界与手机横竖屏生成可复现截图", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }]) {
    await openCleanGame(page, viewport);
    await capture(page, "main-menu-boundary");
    await expectLayoutSafe(page);
    await page.getByRole("button", { name: /^开始游戏/ }).click();
    await page.getByRole("button", { name: /流浪剑修/ }).click();
    await capture(page, "dialogue-boundary");
    await expectLayoutSafe(page);
  }

  await openCleanGame(page, { width: 390, height: 844 });
  await expect(page.getByRole("status", { name: "请将手机旋转至横屏" })).toBeVisible();
  await capture(page, "portrait-rotation-prompt");
  await expectLayoutSafe(page);

  await openCleanGame(page, { width: 844, height: 390 });
  await expect(page.getByRole("status", { name: "请将手机旋转至横屏" })).toBeHidden();
  await capture(page, "landscape-main-menu");
  await expectLayoutSafe(page);
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await capture(page, "landscape-dialogue");
  await expectLayoutSafe(page);
  await expectTouchTargets(page.locator(".vn-quick-menu button:visible, .game-menu-trigger:visible"));
});

test("键盘焦点与减少动态可自动验证", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  await openCleanGame(page);
  await expectTokenContrast(page);
  await page.keyboard.press("Tab");
  const focusedButton = page.locator("button:focus-visible");
  await expect(focusedButton).toBeVisible();
  const outline = await focusedButton.evaluate((button) => {
    const style = getComputedStyle(button);
    return { color: style.outlineColor, style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThanOrEqual(2);
  expect(outline.color).not.toBe("rgba(0, 0, 0, 0)");

  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await page.getByRole("button", { name: "打开游戏菜单", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "游戏菜单" });
  await expect(page.getByRole("button", { name: "关闭游戏菜单", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement)), "反向 Tab 不应离开模态框").toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  const activeAnimations = await page.locator(".story-frame").evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => {
    const timing = animation.effect?.getComputedTiming();
    return { duration: Number(timing?.duration ?? 0), iterations: Number(timing?.iterations ?? 0) };
  }));
  expect(activeAnimations.filter((animation) => animation.duration > 150 || !Number.isFinite(animation.iterations)), "减少动态时不得保留长动画或无限脉冲").toEqual([]);
});
