import { expect, test } from "@playwright/test";
import { chooseRole, resolveScenePresentation, scenes } from "../../lib/xue-gu-yin/game";
import { createSaveSlot } from "../../lib/xue-gu-yin/save";
import { traitorRouteScenes } from "../../lib/xue-gu-yin/story/routes/traitor";

const compact = (text: string) => text.replace(/\s/g, "");

for (const viewport of [{ width: 1366, height: 768 }, { width: 844, height: 390 }]) {
  test(`精修门槛与乔无咎全线正文逐页无损 ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const results = [];
    // Seed scene-boundary saves to verify the current exported copy, independently
    // of the full public-choice route suite and its all-assets coverage requirement.
    for (const sceneId of ["bloodThreshold", ...Object.keys(traitorRouteScenes)]) {
      const traitor = sceneId.startsWith("traitor");
      const game = { ...chooseRole("swordsman"), sceneId, route: traitor ? "traitor" as const : null, routeLocked: traitor };
      const presentation = resolveScenePresentation(game, scenes[sceneId]);
      const slot = createSaveSlot({ game, narrative: { sceneId, page: 0 } });
      await page.evaluate((save) => {
        localStorage.clear();
        localStorage.setItem("xue-gu-yin-save-slots-v2", JSON.stringify([save, null, null, null, null, null]));
      }, slot);
      await page.reload();
      await page.getByRole("button", { name: /^读取存档/ }).click();
      await page.locator(".save-archive .save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
      await expect(page.locator(".story-frame")).toHaveAttribute("data-scene-id", sceneId);
      if (presentation.events.some((event) => event.type === "cg")) {
        await expect(page.locator(".vn-scene-cg")).toBeVisible();
        await page.locator(".vn-scene-cg").click();
        await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
      }
      await page.evaluate(() => document.fonts.ready);
      const beats = new Map<number, string[]>();
      const seen = new Set<string>();
      for (let count = 0; count < 250; count++) {
        const frame = await page.locator(".story-frame").evaluate((stage) => {
          const copy = stage.querySelector<HTMLElement>(".scene-copy")!;
          return {
            beat: Number(stage.getAttribute("data-reading-beat")),
            offset: Number(stage.getAttribute("data-reading-offset")),
            text: copy.textContent ?? "",
            height: copy.clientHeight, scrollHeight: copy.scrollHeight,
            width: copy.clientWidth, scrollWidth: copy.scrollWidth,
          };
        });
        const key = `${frame.beat}:${frame.offset}`;
        expect(seen.has(key), `${sceneId}: duplicate ${key}`).toBe(false);
        seen.add(key);
        expect(frame.scrollHeight, sceneId).toBeLessThanOrEqual(frame.height + 1);
        expect(frame.scrollWidth, sceneId).toBeLessThanOrEqual(frame.width + 1);
        beats.set(frame.beat, [...(beats.get(frame.beat) ?? []), frame.text]);
        // A locked route with one choice continues directly into its result;
        // stop at the end of the source beat instead of waiting for a choice panel.
        if (frame.beat === presentation.beats.length - 1
          && compact(beats.get(frame.beat)!.join("")) === compact(presentation.beats[frame.beat].text)) break;
        await page.locator(".story-frame").click({ position: { x: 8, y: 8 } });
      }
      if (!game.routeLocked || presentation.choices.length > 1) {
        await expect(page.getByRole("navigation", { name: "剧情选项" })).toBeVisible();
      }
      expect(beats.size, sceneId).toBe(presentation.beats.length);
      for (const [index, beat] of presentation.beats.entries()) {
        expect(compact((beats.get(index) ?? []).join("")), `${sceneId}:${index}`).toBe(compact(beat.text));
      }
      results.push({ sceneId, beats: beats.size, pages: seen.size });
    }
    expect(errors).toEqual([]);
    await testInfo.attach("narrative-copy-pages", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
  });
}
