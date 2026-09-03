import { expect, test, type Page } from "@playwright/test";
import { chooseRole, resolveScenePresentation, scenes } from "../../lib/xue-gu-yin/game";

const gate = resolveScenePresentation(chooseRole("swordsman"), scenes.gate);
const compact = (text: string) => text.replace(/\s/g, "");

async function openStory(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}

async function readFrame(page: Page) {
  return page.locator(".story-frame").evaluate((stage) => {
    const copy = stage.querySelector<HTMLElement>(".scene-copy")!;
    const scene = copy.closest(".scene")!.getBoundingClientRect();
    const rect = copy.getBoundingClientRect();
    return {
      beat: Number(stage.getAttribute("data-reading-beat")),
      offset: Number(stage.getAttribute("data-reading-offset")),
      forced: stage.getAttribute("data-page-forced") === "true",
      text: copy.textContent ?? "",
      page: stage.getAttribute("data-narrative-page"),
      height: copy.clientHeight, scrollHeight: copy.scrollHeight,
      width: copy.clientWidth, scrollWidth: copy.scrollWidth,
      inside: rect.top >= scene.top && rect.bottom <= scene.bottom + 1,
    };
  });
}

function expectFits(frame: Awaited<ReturnType<typeof readFrame>>) {
  expect(frame.scrollHeight, JSON.stringify(frame)).toBeLessThanOrEqual(frame.height + 1);
  expect(frame.scrollWidth, JSON.stringify(frame)).toBeLessThanOrEqual(frame.width + 1);
  expect(frame.inside, JSON.stringify(frame)).toBe(true);
  expect(frame.text.length).toBeGreaterThan(0);
  if (!frame.forced) expect(frame.text).not.toMatch(/[，；]$/u);
  expect(frame.text).not.toMatch(/^[”’」』）】》。，！？；，]/u);
}

for (const viewport of [{ width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 844, height: 390 }, { width: 667, height: 375 }, { width: 568, height: 320 }]) {
  test(`完整句子分页与开局全文无损 ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openStory(page);
    const frames = [];
    const seen = new Set<string>();
    for (let count = 0; count < 120; count++) {
      const frame = await readFrame(page);
      expectFits(frame);
      const key = `${frame.beat}:${frame.offset}`;
      expect(seen.has(key), `重复页面 ${key}`).toBe(false);
      seen.add(key);
      frames.push(frame);
      if (count === 1) await page.screenshot({ path: testInfo.outputPath("complete-sentence.png"), animations: "disabled" });
      if (await page.getByRole("navigation", { name: "剧情选项" }).isVisible()) break;
      await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
    }
    await expect(page.getByRole("navigation", { name: "剧情选项" })).toBeVisible();
    for (const [index, beat] of gate.beats.entries()) {
      expect(compact(frames.filter((frame) => frame.beat === index).map((frame) => frame.text).join(""))).toBe(compact(beat.text));
    }
    expect(frames.some((frame) => frame.text.includes("古老阴森的石门前，稀稀落落站着六名气息各异的散修。"))).toBe(true);
    // Choice feedback uses the exact same semantic/layout paginator.
    await page.getByRole("navigation", { name: "剧情选项" }).getByRole("button").first().click();
    const result = [];
    while (await page.locator('[data-reading-kind="choice-result"]').count()) {
      const frame = await readFrame(page);
      expectFits(frame);
      result.push(frame.text);
      expect(result.length).toBeLessThan(100);
      await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
    }
    expect(compact(result.join(""))).toBe(compact(gate.choices[0].result ?? ""));
    expect(errors).toEqual([]);
    await testInfo.attach("pages", { body: JSON.stringify(frames, null, 2), contentType: "application/json" });
  });
}

test("旋转、字体变化和存读档保持文字位置，旧存档从场景开头重读", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await openStory(page);
  for (let index = 0; index < 6; index++) await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "存入", exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("xue-gu-yin-save-slots-v2")!)[0]);
  await page.getByRole("button", { name: "返回", exact: true }).click();
  expect(saved.narrative.anchor.beatIndex).toBeGreaterThan(0);
  await page.setViewportSize({ width: 568, height: 320 });
  await expect.poll(async () => { const frame = await readFrame(page); return frame.scrollHeight <= frame.height + 1; }).toBe(true);
  let frame = await readFrame(page);
  expectFits(frame);
  expect(frame.beat).toBe(saved.narrative.anchor.beatIndex);
  expect(frame.offset).toBeLessThanOrEqual(saved.narrative.anchor.offset);
  expect(frame.offset + frame.text.length).toBeGreaterThan(saved.narrative.anchor.offset);
  await page.addStyleTag({ content: ".vn-story-core .scene-copy p { font-size: 28px !important; line-height: 1.9 !important; }" });
  // A font/theme update must be detected even without a window resize event.
  await expect.poll(async () => { const frame = await readFrame(page); return frame.scrollHeight <= frame.height + 1; }).toBe(true);
  frame = await readFrame(page);
  expectFits(frame);
  expect(frame.forced).toBe(true);
  expect(frame.beat).toBe(saved.narrative.anchor.beatIndex);
  expect(frame.offset).toBeLessThanOrEqual(saved.narrative.anchor.offset);
  await page.screenshot({ path: testInfo.outputPath("large-font.png"), animations: "disabled" });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect.poll(async () => (await readFrame(page)).forced).toBe(false);
  expectFits(await readFrame(page));
  await page.reload();
  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await page.getByRole("button", { name: /^存读档/ }).click();
  await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  frame = await readFrame(page);
  expectFits(frame);
  expect(frame.beat).toBe(saved.narrative.anchor.beatIndex);
  expect(frame.offset).toBeLessThanOrEqual(saved.narrative.anchor.offset);
  await page.getByRole("button", { name: "打开游戏菜单" }).click();
  const firstSlot = page.getByRole("dialog", { name: "游戏菜单" }).locator(".save-slot").first();
  await firstSlot.getByRole("button", { name: "存入", exact: true }).click();
  await firstSlot.getByRole("button", { name: "确认覆盖", exact: true }).click();
  const slot = await page.evaluate(() => JSON.parse(localStorage.getItem("xue-gu-yin-save-slots-v2")!)[0]);
  expect(slot.narrative.anchor.beatIndex).toBe(frame.beat);
  delete slot.narrative.anchor;
  slot.narrative.page = 99;
  await page.evaluate((legacy) => localStorage.setItem("xue-gu-yin-save-slots-v2", JSON.stringify([legacy])), slot);
  await page.reload();
  await page.getByRole("button", { name: /^读取存档/ }).click();
  await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  expect((await readFrame(page)).beat).toBe(0);
  expect((await readFrame(page)).offset).toBe(0);
});
