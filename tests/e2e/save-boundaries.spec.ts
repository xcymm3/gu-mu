import { expect, test } from "@playwright/test";
import { chooseRole, scenes, startBattle } from "../../lib/xue-gu-yin/game";
import { createSaveSlot } from "../../lib/xue-gu-yin/save";

test("战败结算保存显示终章并恢复结局，不会进入空白场景", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const battleScene = scenes.puppets;
  // startBattle refills essence; exhaust it in the test fixture so the public Rest action is available.
  const game = { ...startBattle({ ...chooseRole("swordsman"), sceneId: battleScene.id, health: 1 }, battleScene), essence: 0 };
  const slot = createSaveSlot({ game, narrative: { sceneId: game.sceneId, page: 0 } });
  await page.goto("/");
  await page.evaluate((slot) => localStorage.setItem("xue-gu-yin-save-slots-v2", JSON.stringify([slot])), slot);
  await page.reload();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await page.locator(".save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  const actions = page.getByRole("navigation", { name: "选择本回合蛊术" });
  await actions.getByRole("button", { name: /调息/ }).click();
  await expect(page.locator(".story-frame")).toHaveAttribute("data-reading-kind", "battle-result");
  await page.getByRole("button", { name: /^存读档/ }).click();
  const saved = page.locator(".save-slot").nth(1);
  await saved.getByRole("button", { name: "存入", exact: true }).click();
  await expect(saved).toContainText("终章 · 结局");
  await expect(saved.locator("strong")).toHaveText("命丧守墓傀儡");
  await saved.getByRole("button", { name: "读取", exact: true }).click();
  await expect(page.getByRole("heading", { name: "命丧守墓傀儡", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "返回主界面", exact: true }).click();
  await page.getByRole("button", { name: /^结局一览/ }).click();
  await expect(page.locator(".ending-entry.is-unlocked")).toContainText("命丧守墓傀儡");
  expect(errors).toEqual([]);
});

test("自动与快进能推进完整句子，打开存档界面后均暂停", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  const stage = page.locator(".story-frame");
  for (const mode of [/^自动/, /^快进/]) {
    const previous = await stage.getAttribute("data-narrative-page");
    await page.getByRole("button", { name: mode }).click();
    await expect(stage).not.toHaveAttribute("data-narrative-page", previous!);
    await page.getByRole("button", { name: /^存读档/ }).click();
    await expect(page.getByRole("heading", { name: "存读档", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "返回", exact: true }).click();
    await expect(page.getByRole("button", { name: /^自动/ })).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("button", { name: /^快进/ })).toHaveAttribute("aria-pressed", "false");
  }
});
