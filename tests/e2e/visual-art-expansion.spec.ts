import { expect, test, type Browser, type Page, type Response } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  combatActionEffectAssets,
  enemyCombatEffectAsset,
} from "../../lib/xue-gu-yin/assets";
import {
  chooseRole,
  scenes,
  startBattle,
  type GameState,
  type GuAction,
  type RoleId,
} from "../../lib/xue-gu-yin/game";
import { createSaveSlot } from "../../lib/xue-gu-yin/save";

const saveStorageKey = "xue-gu-yin-save-slots-v2";
const taskId = "visual-art-expansion-v1";
const proofRawRoot = path.resolve(process.cwd(), ".agent", "tasks", taskId, "raw");
const layoutScreenshotRoot = path.join(proofRawRoot, "screenshots", "layout");
const saveCombatScreenshotRoot = path.join(proofRawRoot, "screenshots", "save-and-combat");
const uiRuntimeEntries: Array<Record<string, unknown>> = [];
const effectRuntimeEntries: Array<Record<string, unknown>> = [];
let networkBudget: Record<string, unknown> = {};
let reducedMotionSmoke: Record<string, unknown> = {};
const taskViewports = [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 844, height: 390 },
  { width: 390, height: 844 },
] as const;

const actionCases: Array<{ action: Exclude<GuAction, "rest">; label: RegExp; roleId: RoleId }> = [
  { action: "blood", label: /^月光蛊，/, roleId: "swordsman" },
  { action: "armor", label: /^甲衣蛊，/, roleId: "swordsman" },
  { action: "heal", label: /^回春蛊，/, roleId: "healer" },
  { action: "sword", label: /^剑鸣蛊，/, roleId: "swordsman" },
  { action: "charm", label: /^惑心蛊，/, roleId: "heir" },
  { action: "blooddemon", label: /^血魔蛊，/, roleId: "swordsman" },
];

function makeBattleSave(roleId: RoleId) {
  const selected = chooseRole(roleId);
  const prepared: GameState = {
    ...selected,
    health: 40,
    maxHealth: 40,
    essence: 40,
    maxEssence: 40,
    flags: [...selected.flags, "血魔蛊"],
    sceneId: "puppets",
  };
  const game = startBattle(prepared, scenes.puppets);
  return createSaveSlot({
    game,
    narrative: { sceneId: game.sceneId, page: 0 },
    now: new Date("2026-09-01T00:00:00.000Z"),
  });
}

async function installSave(page: Page, roleId: RoleId) {
  const slots = [makeBattleSave(roleId), null, null, null, null, null];
  await page.addInitScript(({ key, value }) => {
    window.localStorage.clear();
    window.localStorage.setItem(key, value);
    Math.random = () => 0.75;
  }, { key: saveStorageKey, value: JSON.stringify(slots) });
}

async function loadFirstSlot(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "血蛊引", exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "选择本回合蛊术" })).toBeVisible();
}

async function newBattlePage(browser: Browser, roleId: RoleId, reducedMotion = false) {
  const context = await browser.newContext({
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
    viewport: { width: 1366, height: 768 },
  });
  const page = await context.newPage();
  await installSave(page, roleId);
  await loadFirstSlot(page);
  return { context, page };
}

type CombatEffectObservation = {
  key: string;
  order: number;
  phase: string | null;
  requested_path: string | null;
  visible: boolean;
};

async function installCombatEffectObserver(page: Page) {
  await page.evaluate(() => {
    const browserWindow = window as typeof window & {
      __combatEffectObserver?: MutationObserver;
      __combatEffectTimeline?: CombatEffectObservation[];
    };
    browserWindow.__combatEffectObserver?.disconnect();
    browserWindow.__combatEffectTimeline = [];
    const recordEffects = () => {
      for (const element of document.querySelectorAll<HTMLElement>("[data-combat-effect-key]")) {
        const key = element.dataset.combatEffectKey;
        if (!key || browserWindow.__combatEffectTimeline!.some((entry) => entry.key === key)) continue;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        browserWindow.__combatEffectTimeline!.push({
          key,
          order: browserWindow.__combatEffectTimeline!.length,
          phase: element.dataset.combatEffectPhase ?? null,
          requested_path: element.querySelector("img")?.getAttribute("src") ?? null,
          visible: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden",
        });
      }
    };
    const observer = new MutationObserver(recordEffects);
    observer.observe(document.body, { childList: true, subtree: true });
    browserWindow.__combatEffectObserver = observer;
    recordEffects();
  });
}

async function readCombatEffectTimeline(page: Page): Promise<CombatEffectObservation[]> {
  return page.evaluate(() => {
    const browserWindow = window as typeof window & { __combatEffectTimeline?: CombatEffectObservation[] };
    return browserWindow.__combatEffectTimeline ?? [];
  });
}

async function waitForImages(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight - window.innerHeight,
    width: document.documentElement.scrollWidth - window.innerWidth,
  }));
  expect(overflow.width, `页面出现横向滚动：${JSON.stringify(overflow)}`).toBeLessThanOrEqual(0);
  expect(overflow.height, `页面出现纵向滚动：${JSON.stringify(overflow)}`).toBeLessThanOrEqual(0);
}

async function expectSettingsContentReachable(page: Page) {
  const settingsList = page.locator(".settings-list");
  const settingsHeader = page.locator(".settings-card > .menu-page-header");
  const layout = await settingsList.evaluate((list) => {
    const listRect = list.getBoundingClientRect();
    const children = [...list.children].map((child) => {
      const element = child as HTMLElement;
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        clientHeight: element.clientHeight,
        height: rect.height,
        scrollHeight: element.scrollHeight,
        top: rect.top,
      };
    });
    return {
      children,
      clientHeight: list.clientHeight,
      listBottom: listRect.bottom,
      listTop: listRect.top,
      scrollHeight: list.scrollHeight,
    };
  });

  expect(layout.clientHeight, "设置列表应获得非零的内部滚动区域").toBeGreaterThan(0);
  expect(layout.children.length, "设置列表应包含全部设置分组").toBe(5);
  const headerBeforeScroll = await settingsHeader.boundingBox();
  expect(headerBeforeScroll, "设置页固定标题栏应有可测量边界").not.toBeNull();
  expect(layout.listTop, "设置内容必须从固定标题栏下方开始").toBeGreaterThanOrEqual(headerBeforeScroll!.y + headerBeforeScroll!.height - 1);
  for (let index = 0; index < layout.children.length; index += 1) {
    const item = layout.children[index];
    expect(item.height, `设置分组 ${index + 1} 不应被压缩为空`).toBeGreaterThan(0);
    expect(item.scrollHeight - item.clientHeight, `设置分组 ${index + 1} 的内容不应在自身边界内裁切`).toBeLessThanOrEqual(1);
    if (index > 0) {
      expect(item.top, `设置分组 ${index + 1} 不应覆盖前一个分组`).toBeGreaterThanOrEqual(layout.children[index - 1].bottom - 1);
    }
  }

  const lastSetting = settingsList.locator(":scope > *").last();
  await settingsList.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  const reachedLastSetting = await lastSetting.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const listRect = element.parentElement!.getBoundingClientRect();
    return rect.top >= listRect.top - 1 && rect.bottom <= listRect.bottom + 1;
  });
  expect(reachedLastSetting, "内部滚动后最后一个设置控件应完整可达").toBe(true);
  const headerAfterScroll = await settingsHeader.boundingBox();
  expect(headerAfterScroll, "内部滚动后固定标题栏不得被移出或遮挡").toEqual(headerBeforeScroll);
  const headerHitTest = await settingsHeader.evaluate((header) => {
    const rect = header.getBoundingClientRect();
    const node = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      isLandscape: window.innerWidth > window.innerHeight,
      ownsCenterPoint: node === header || (node !== null && header.contains(node)),
    };
  });
  if (headerHitTest.isLandscape) {
    expect(headerHitTest.ownsCenterPoint, "设置内容滚动后不得绘制到固定标题栏之上").toBe(true);
  }
  await settingsList.evaluate((element) => { element.scrollTop = 0; });
}

async function writeProofJson(fileName: string, value: unknown) {
  await writeFile(path.join(proofRawRoot, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function observeAsset(page: Page, selector: string, trigger: string) {
  const locator = page.locator(selector);
  await expect(locator).toBeAttached();
  const key = await locator.getAttribute("data-asset-key");
  const image = locator.locator("img").first();
  const source = await image.getAttribute("src");
  return {
    key,
    trigger,
    requested_path: source ? new URL(source, page.url()).pathname : null,
    attached: await locator.count() > 0,
    visible: await locator.isVisible(),
  };
}

test.beforeAll(async () => {
  await mkdir(layoutScreenshotRoot, { recursive: true });
  await mkdir(saveCombatScreenshotRoot, { recursive: true });
  await mkdir(path.join(proofRawRoot, "fixtures"), { recursive: true });
});

test.afterAll(async () => {
  const fixture = makeBattleSave("healer");
  await writeProofJson("ui-runtime-report.json", {
    task_id: taskId,
    generated_by: "tests/e2e/visual-art-expansion.spec.ts",
    entries: uiRuntimeEntries,
  });
  await writeProofJson("effect-runtime-matrix.json", {
    task_id: taskId,
    generated_by: "tests/e2e/visual-art-expansion.spec.ts",
    expected_keys: [...Object.values(combatActionEffectAssets), enemyCombatEffectAsset],
    entries: effectRuntimeEntries,
  });
  await writeProofJson("network-budget.json", networkBudget);
  await writeProofJson("fixtures/save-v6-no-visual-metadata.json", fixture);
  await writeProofJson("save-combat-smoke.json", {
    task_id: taskId,
    generated_by: "tests/e2e/visual-art-expansion.spec.ts",
    version_6_fixture: "raw/fixtures/save-v6-no-visual-metadata.json",
    player_effects_observed: [...new Set(effectRuntimeEntries.filter((entry) => entry.phase === "player").map((entry) => entry.key))],
    enemy_effect_observed: effectRuntimeEntries.some((entry) => entry.key === enemyCombatEffectAsset),
    screenshots: "raw/screenshots/save-and-combat/",
  });
  await writeProofJson("reduced-motion-smoke.json", reducedMotionSmoke);
});

test("全新上下文首页满足图片请求与传输预算", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  const imageResponses: Response[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "image") imageResponses.push(response);
  });

  await page.goto("/");
  await waitForImages(page);
  const resources = await Promise.all(imageResponses.map(async (response) => ({
    encodedBodySize: (await response.body()).byteLength,
    name: response.url(),
  })));
  const transferredBytes = resources.reduce((sum, resource) => sum + resource.encodedBodySize, 0);

  expect(resources.length, JSON.stringify(resources, null, 2)).toBeLessThanOrEqual(4);
  expect(transferredBytes, JSON.stringify(resources, null, 2)).toBeLessThanOrEqual(2.5 * 1024 * 1024);
  expect(resources.map((resource) => new URL(resource.name).pathname)).toEqual(["/ui/main-menu-v1.webp"]);
  networkBudget = {
    task_id: taskId,
    generated_by: "tests/e2e/visual-art-expansion.spec.ts",
    viewport: { width: 1366, height: 768 },
    maximum_bytes: 2.5 * 1024 * 1024,
    transferred_bytes: transferredBytes,
    requests: resources.map((resource) => ({ ...resource, path: new URL(resource.name).pathname })),
    status: "PASS",
  };
  await context.close();
});

test("三页正式主视觉在四个合同视口保持可达且无全局溢出", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  for (const viewport of taskViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await waitForImages(page);
    await expect(page.locator("html")).toHaveAttribute("data-reduce-motion", "false");
    await expect(page.locator('[data-asset-key="ui.main-menu"]')).toBeVisible();
    await expectNoOverflow(page);
    uiRuntimeEntries.push(await observeAsset(page, '[data-asset-key="ui.main-menu"]', `${viewport.width}x${viewport.height}:main-menu`));
    await page.screenshot({ path: path.join(layoutScreenshotRoot, `${viewport.width}x${viewport.height}-main-menu.png`) });

    const openSettings = page.getByRole("button", { name: /^游戏设置/ });
    if (viewport.width === 390) await openSettings.dispatchEvent("click");
    else await openSettings.click();
    await expect(page.locator('[data-asset-key="ui.settings"]')).toBeAttached();
    await expectNoOverflow(page);
    await expectSettingsContentReachable(page);
    uiRuntimeEntries.push(await observeAsset(page, '[data-asset-key="ui.settings"]', `${viewport.width}x${viewport.height}:settings`));
    await page.screenshot({ path: path.join(layoutScreenshotRoot, `${viewport.width}x${viewport.height}-settings.png`) });
    if (viewport.width === 844) {
      const settingsHeader = page.locator(".settings-card > .menu-page-header");
      const headerBeforeScroll = await settingsHeader.boundingBox();
      await page.locator(".settings-list").evaluate((element) => { element.scrollTop = element.scrollHeight; });
      await expect(settingsHeader).toBeVisible();
      expect(await settingsHeader.boundingBox(), "内部滚动不得移动设置页固定标题栏").toEqual(headerBeforeScroll);
      await page.screenshot({ path: path.join(layoutScreenshotRoot, "844x390-settings-bottom.png") });
      await page.locator(".settings-list").evaluate((element) => { element.scrollTop = 0; });
    }
    const settingsBack = page.getByRole("button", { name: "返回", exact: true });
    if (viewport.width === 390) await settingsBack.dispatchEvent("click");
    else await settingsBack.click();

    const openSaves = page.getByRole("button", { name: /^读取存档/ });
    if (viewport.width === 390) await openSaves.dispatchEvent("click");
    else await openSaves.click();
    await expect(page.locator('[data-asset-key="ui.saves"]')).toBeAttached();
    await expect(page.locator(".save-archive .save-slot")).toHaveCount(6);
    await expectNoOverflow(page);
    uiRuntimeEntries.push(await observeAsset(page, '[data-asset-key="ui.saves"]', `${viewport.width}x${viewport.height}:saves`));
    await page.screenshot({ path: path.join(layoutScreenshotRoot, `${viewport.width}x${viewport.height}-saves.png`) });
  }
});

test("六类玩家位图特效均先于敌方反击且回合可继续", async ({ browser }) => {
  test.setTimeout(120_000);
  for (const item of actionCases) {
    const { context, page } = await newBattlePage(browser, item.roleId);
    const actionButton = page.getByRole("navigation", { name: "选择本回合蛊术" }).getByRole("button", { name: item.label });
    await expect(actionButton).toBeEnabled();
    await installCombatEffectObserver(page);
    await actionButton.click();
    const playerEffect = page.locator(`[data-combat-effect-key="${combatActionEffectAssets[item.action]}"]`);
    await expect(playerEffect).toBeVisible();
    await page.screenshot({ path: path.join(saveCombatScreenshotRoot, `effect-${item.action}-player.png`) });
    await expect(actionButton).toBeEnabled();
    await expect.poll(async () => (await readCombatEffectTimeline(page)).map((entry) => entry.key))
      .toContain(enemyCombatEffectAsset);
    const timeline = await readCombatEffectTimeline(page);
    const playerObservation = timeline.find((entry) => entry.key === combatActionEffectAssets[item.action]);
    const enemyObservation = timeline.find((entry) => entry.key === enemyCombatEffectAsset);
    expect(playerObservation, `${item.action} 玩家特效必须被运行时观察到`).toBeDefined();
    expect(enemyObservation, `${item.action} 后的敌方反击特效必须被运行时观察到`).toBeDefined();
    expect(playerObservation!.visible, `${item.action} 玩家特效必须具有可见边界`).toBe(true);
    expect(enemyObservation!.visible, `${item.action} 敌方特效必须具有可见边界`).toBe(true);
    expect(playerObservation!.order, `${item.action} 玩家特效必须先于敌方反击`).toBeLessThan(enemyObservation!.order);
    effectRuntimeEntries.push(
      { action: item.action, ...playerObservation, reduced_motion: false },
      { action: item.action, ...enemyObservation, reduced_motion: false },
    );
    await context.close();
  }
});

test("减少动态与特效请求失败均保留文字反馈和下一回合", async ({ browser }) => {
  const reduced = await newBattlePage(browser, "swordsman", true);
  const reducedButton = reduced.page.getByRole("navigation", { name: "选择本回合蛊术" }).getByRole("button", { name: /^月光蛊，/ });
  const startedAt = Date.now();
  await reducedButton.click();
  await expect(reduced.page.locator('[data-combat-effect-key="effect.player-blood-attack"]')).toBeVisible();
  await expect(reducedButton).toBeEnabled();
  const reducedDurationMs = Date.now() - startedAt;
  expect(reducedDurationMs).toBeLessThan(700);
  await reduced.page.screenshot({ path: path.join(saveCombatScreenshotRoot, "effect-reduced-motion.png") });
  await reduced.context.close();

  const failed = await newBattlePage(browser, "swordsman");
  await failed.page.route("**/effects/player-blood-attack-v1.webp", (route) => route.abort("failed"));
  const failedButton = failed.page.getByRole("navigation", { name: "选择本回合蛊术" }).getByRole("button", { name: /^月光蛊，/ });
  await failedButton.click();
  await expect(failed.page.getByText("特效资源未载入，战斗照常结算", { exact: true })).toBeVisible();
  await failed.page.screenshot({ path: path.join(saveCombatScreenshotRoot, "effect-request-fallback.png") });
  await expect(failedButton).toBeEnabled();
  reducedMotionSmoke = {
    task_id: taskId,
    generated_by: "tests/e2e/visual-art-expansion.spec.ts",
    reduced_motion_duration_ms: reducedDurationMs,
    reduced_motion_limit_ms: 700,
    failed_request_fallback_visible: true,
    next_turn_available_after_fallback: true,
    screenshots: [
      "raw/screenshots/save-and-combat/effect-reduced-motion.png",
      "raw/screenshots/save-and-combat/effect-request-fallback.png",
    ],
    status: "PASS",
  };
  await failed.context.close();
});

test("版本 6 存档缺少视觉元数据时仍由公开读档入口恢复", async ({ page }) => {
  await installSave(page, "healer");
  await loadFirstSlot(page);
  await expect(page.getByLabel("血蛊引游戏界面")).toHaveAttribute("data-scene-id", "puppets");
  await expect(page.locator(".health-stat strong")).toContainText("40/40");
  await expect(page.locator(".battle-essence strong")).toContainText("40/40");
  const stored = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "[]")[0], saveStorageKey);
  expect(stored.version).toBe(6);
  expect(stored.game.visualState).toBeUndefined();
  await page.screenshot({ path: path.join(saveCombatScreenshotRoot, "save-v6-restored-battle.png") });
});
