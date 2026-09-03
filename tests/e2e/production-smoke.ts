import { expect, test, type Page } from "@playwright/test";

type ReleaseMarker = {
  version: string;
  channel: string;
  gitSha: string;
};

async function waitForProgressChange(page: Page, previous: string) {
  const stage = page.getByLabel("血蛊引游戏界面");
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await stage.click({ position: { x: 8, y: 8 } });
    if ((await stage.getAttribute("data-narrative-page")) !== previous) return;
  }
  throw new Error("推进 12 次后剧情进度仍未变化");
}

test("生产站点部署目标提交并完成开始与存读档冒烟", async ({ page, request }) => {
  const failures: string[] = [];
  const expectedSha = process.env.EXPECTED_GIT_SHA?.trim();

  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console.error: ${message.text()}`);
  });
  page.on("requestfailed", (failedRequest) => {
    failures.push(`requestfailed: ${failedRequest.method()} ${failedRequest.url()} (${failedRequest.failure()?.errorText ?? "unknown"})`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`response: ${response.status()} ${response.url()}`);
  });

  if (expectedSha) {
    await expect.poll(async () => {
      const response = await request.get(`/release.json?expected=${encodeURIComponent(expectedSha)}&t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok()) return `http-${response.status()}`;
      const marker = await response.json() as ReleaseMarker;
      return marker.gitSha;
    }, {
      message: `等待生产域名部署提交 ${expectedSha}`,
      timeout: 300_000,
      intervals: [5_000, 10_000, 15_000],
    }).toBe(expectedSha);
  }

  const markerResponse = await request.get(`/release.json?t=${Date.now()}`);
  expect(markerResponse.ok()).toBe(true);
  const marker = await markerResponse.json() as ReleaseMarker;
  expect(marker).toMatchObject({ version: "0.2.0-rc.2", channel: "release-candidate" });

  await page.addInitScript(() => window.localStorage.clear());
  const navigation = await page.goto("/", { waitUntil: "networkidle" });
  expect(navigation?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
  await expect(page.getByText(/一座蛊墓，六名四转修士/)).toBeVisible();

  const portraitResponse = await request.get("/characters/ji-qinghan-v1.webp");
  expect(portraitResponse.ok()).toBe(true);

  await page.getByRole("button", { name: /^开始游戏/ }).click();
  await expect(page.getByText("请选择你的身份")).toBeVisible();
  await page.getByRole("button", { name: /流浪剑修/ }).click();
  const stage = page.getByLabel("血蛊引游戏界面");
  await expect(stage).toHaveAttribute("data-scene-id", "gate");
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await expect(page.getByLabel("篇章信息")).toContainText("Chapter 1-1");
  await expect(page.getByLabel("篇章信息")).not.toContainText("夜雨墓门");
  await expect(stage).not.toContainText("夜雨墓门");
  await expect(stage.locator(".scene h1")).toHaveCount(0);
  await expect(stage.locator(".narrative-progress")).toHaveCount(0);

  const savedProgress = await stage.getAttribute("data-narrative-page");
  expect(savedProgress).not.toBeNull();
  await page.getByRole("button", { name: /^存读档/ }).click();
  const firstSlot = page.locator(".save-archive .save-slot").first();
  await firstSlot.getByRole("button", { name: "存入", exact: true }).click();
  await expect(firstSlot).toContainText("Chapter 1-1");
  await expect(firstSlot.locator("strong")).toHaveText("夜雨墓门");
  await expect(page.getByRole("status")).toHaveText("已保存至存档 1");
  await page.getByRole("button", { name: "返回", exact: true }).click();

  await waitForProgressChange(page, savedProgress!);
  await page.getByRole("button", { name: /^存读档/ }).click();
  await firstSlot.getByRole("button", { name: "读取", exact: true }).click();
  await page.locator(".vn-scene-cg").click();
  await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
  await expect(stage).toHaveAttribute("data-narrative-page", savedProgress!);

  expect(failures, "生产站点不应出现页面、控制台、网络或 HTTP 错误").toEqual([]);
});
