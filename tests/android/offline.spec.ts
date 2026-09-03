import { chromium, expect, test, type Browser } from "@playwright/test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import path from "node:path";

test("Android APK 在断网环境启动，显示 CG 并持久化存档", async ({}, testInfo) => {
  const serial = process.env.ANDROID_TEST_SERIAL;
  if (!serial?.startsWith("emulator-")) throw new Error("Set ANDROID_TEST_SERIAL to the dedicated emulator; never a player's phone.");
  const sdk = process.env.ANDROID_HOME;
  if (!sdk) throw new Error("ANDROID_HOME is required.");
  const adbPath = path.join(sdk, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb");
  const exec = promisify(execFile);
  const adb = async (...args: string[]) => (await exec(adbPath, ["-s", serial, ...args], { windowsHide: true })).stdout.trim();
  expect((await adb("emu", "avd", "name")).split(/\r?\n/)[0].trim()).toBe("xueguyin-offline-test");
  const appId = "top.xcymm3.adv";
  const apk = process.env.ANDROID_TEST_APK || path.resolve("android/app/build/outputs/apk/debug/app-debug.apk");
  const saveKey = "xue-gu-yin-save-slots-v2";
  let browser: Browser | undefined;
  let port: string | undefined;
  const failures: string[] = [];

  async function screenshot(name: string) {
    // Capture Android's actual surface; CDP screenshots can disturb old WebView viewport/compositing.
    const { stdout } = await exec(adbPath, ["-s", serial!, "exec-out", "screencap", "-p"], {
      windowsHide: true, encoding: "buffer", maxBuffer: 32 * 1024 * 1024,
    });
    await writeFile(testInfo.outputPath(name), stdout);
  }

  async function launch() {
    await adb("shell", "am", "start", "-W", "-n", `${appId}/.MainActivity`);
    let pid = "";
    await expect.poll(async () => {
      pid = await adb("shell", "pidof", appId);
      return pid.length > 0 && (await adb("shell", "cat", "/proc/net/unix")).includes(`webview_devtools_remote_${pid}`);
    }).toBe(true);
    port = await adb("forward", "tcp:0", `localabstract:webview_devtools_remote_${pid}`);
    // WebView has no browser-context download manager; preserve its native settings.
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { noDefaults: true });
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.waitForEvent("page");
    page.on("pageerror", (error) => failures.push(error.message));
    await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
    expect(page.url()).toBe("https://adv.xcymm3.top/");
    expect(await page.evaluate(() => navigator.userAgent)).toContain("XueGuYinAndroid/2.0-Offline");
    expect(await page.evaluate(() => innerWidth > innerHeight)).toBe(true);
    return page;
  }

  async function stop() {
    await browser?.close();
    browser = undefined;
    await adb("shell", "am", "force-stop", appId);
    if (port) await adb("forward", "--remove", `tcp:${port}`);
    port = undefined;
  }

  try {
    // Skip Android's one-time immersive-mode coaching bubble on this dedicated test AVD.
    await adb("shell", "settings", "put", "secure", "immersive_mode_confirmations", "confirmed");
    await adb("shell", "svc", "wifi", "disable");
    await adb("shell", "svc", "data", "disable");
    expect(await adb("shell", "settings", "get", "global", "wifi_on")).toBe("0");
    expect(await adb("install", "-r", apk)).toContain("Success");
    await adb("shell", "am", "force-stop", appId);
    let page = await launch();
    // Only the dedicated test AVD's app data is reset, never a real device/profile.
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
    await screenshot("android-home.png");
    await page.getByRole("button", { name: /^开始游戏/ }).click();
    await page.getByRole("button", { name: /流浪剑修/ }).click();
    await expect(page.locator(".vn-scene-cg")).toBeVisible();
    await expect(page.locator(".vn-scene-cg-title")).toContainText("Chapter 1-1");
    await expect(page.locator(".vn-scene-cg-title")).toContainText("夜雨墓门");
    await expect.poll(() => page.locator(".vn-scene-cg img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await screenshot("android-cg.png");
    await page.locator(".vn-scene-cg").click();
    await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
    await expect(page.locator('.vn-stage[data-asset-key="background.gate-empty"]')).toBeVisible();
    const layout = await page.evaluate(() => [".scene", ".scene-copy", ".scene-copy p", ".vn-speaker", ".vn-quick-menu"].map((selector) => {
      const element = document.querySelector(selector)!;
      const style = getComputedStyle(element);
      return { selector, rect: element.getBoundingClientRect().toJSON(), position: style.position,
        display: style.display, top: style.top, bottom: style.bottom, margin: style.margin, padding: style.padding,
        transform: style.transform, gridRows: style.gridTemplateRows, gridRow: style.gridRow,
        space1: style.getPropertyValue("--space-1"), clearance: style.getPropertyValue("--vn-utility-clearance") };
    }));
    await testInfo.attach("android-layout", { body: JSON.stringify(layout, null, 2), contentType: "application/json" });

    const audio = await page.evaluate(async () => {
      const response = await fetch("/audio/bgm-tomb-depths-v1.wav");
      const context = new AudioContext();
      try {
        const decoded = await context.decodeAudioData(await response.arrayBuffer());
        return { status: response.status, type: response.headers.get("content-type"), duration: decoded.duration };
      } finally { await context.close(); }
    });
    expect(audio.status).toBe(200);
    expect(audio.type).toContain("audio/wav");
    expect(audio.duration).toBeGreaterThan(0);

    await page.getByRole("button", { name: /^快存/ }).click();
    await expect(page.getByText("快速存档完成", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "打开游戏菜单" }).click();
    await page.getByRole("dialog", { name: "游戏菜单" }).locator(".save-slot").first().getByRole("button", { name: "存入", exact: true }).click();
    const saved = await page.evaluate((key) => localStorage.getItem(key), saveKey);
    expect(saved).toBeTruthy();
    await page.getByRole("button", { name: "关闭游戏菜单" }).click();
    await expect.poll(() => page.evaluate(() => {
      const scene = document.querySelector(".scene")!.getBoundingClientRect();
      const text = document.querySelector(".scene-copy")!.getBoundingClientRect();
      const menu = document.querySelector(".vn-quick-menu")!.getBoundingClientRect();
      return text.top >= scene.top && text.bottom <= scene.bottom && scene.bottom <= menu.top;
    })).toBe(true);
    await screenshot("android-game.png");

    expect(await page.evaluate(async () => (await fetch("/missing-android-test.txt")).status)).toBe(404);
    expect(await page.evaluate(async () => {
      try { return (await fetch("https://example.com/", { mode: "no-cors", signal: AbortSignal.timeout(3000) })).ok; } catch { return false; }
    })).toBe(false);
    const userAgent = await page.evaluate(() => navigator.userAgent);
    await stop();
    page = await launch();
    expect(await page.evaluate((key) => localStorage.getItem(key), saveKey)).toBe(saved);
    await page.getByRole("button", { name: /^读取存档/ }).click();
    await page.locator(".save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
    await expect(page.locator(".vn-stage")).toBeVisible();
    // Reloading a save starts a new viewing session; the existing game may replay its scene CG.
    if (await page.locator(".vn-scene-cg").count()) await page.locator(".vn-scene-cg").click();
    await expect(page.locator(".vn-scene-cg")).toHaveCount(0);
    await screenshot("android-restored.png");
    expect(failures).toEqual([]);
    await testInfo.attach("android-runtime", { body: JSON.stringify({ serial, userAgent, audio, saved, failures }, null, 2), contentType: "application/json" });
  } finally {
    await stop();
  }
});
