import { chromium, expect, test, type Browser, type Page } from "@playwright/test";
import { copyFile, cp, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { execFile, spawn, type ChildProcess } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import path from "node:path";

const saveKey = "xue-gu-yin-save-slots-v2";

test("便携 EXE 离线读取资源，重启及移动目录保留玩家存档", async ({}, testInfo) => {
  test.skip(process.platform !== "win32", "Windows x64 便携版测试");
  const output = path.resolve("dist/desktop");
  const files = await readdir(output);
  const executable = process.env.DESKTOP_EXE || path.join(output, files.find((file) => file.endsWith("-portable.exe")) || "missing.exe");
  const runs = testInfo.outputPath("runs");
  await mkdir(runs, { recursive: true });
  const work = await mkdtemp(path.join(runs, "portable-"));
  const original = path.join(work, "原始目录 with spaces");
  const moved = path.join(work, "移动后的目录");
  await mkdir(original);
  await copyFile(executable, path.join(original, "血蛊引.exe"));
  let browser: Browser | undefined;
  let child: ChildProcess | undefined;
  let exited: Promise<void> | undefined;
  const execute = promisify(execFile);
  const failures: string[] = [];
  const remoteRequests: string[] = [];

  async function launch(directory: string) {
    const env: NodeJS.ProcessEnv = { ...process.env };
    for (const key of ["ELECTRON_RUN_AS_NODE", "PORTABLE_EXECUTABLE_DIR", "PORTABLE_EXECUTABLE_FILE"]) delete env[key];
    const dataPath = path.join(directory, "血蛊引-data");
    const portFile = path.join(dataPath, "DevToolsActivePort");
    await rm(portFile, { force: true });
    // NSIS does not forward child stderr. Attach via Chromium's port file instead
    // of Electron.launch(), which waits for inspector output on that pipe.
    const launched = spawn(path.join(directory, "血蛊引.exe"), ["--remote-debugging-port=0"], { env, stdio: "ignore", windowsHide: true });
    child = launched;
    let launchError: Error | undefined;
    launched.once("error", (error) => { launchError = error; });
    exited = new Promise<void>((resolve) => launched.once("exit", () => resolve()));
    let port = 0;
    await expect.poll(async () => {
      if (launchError) throw launchError;
      try { port = Number((await readFile(portFile, "utf8")).split("\n")[0]); } catch { port = 0; }
      return port;
    }, { timeout: 60_000 }).toBeGreaterThan(0);
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.waitForEvent("page");
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("request", (request) => {
      if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
    expect(page.url()).toBe("xueguyin://game/");
    expect(await page.evaluate(() => navigator.userAgent)).toContain("Electron/44.1.1");
    const processes = await execute("powershell.exe", ["-NoProfile", "-Command", "Get-CimInstance Win32_Process -Filter \"Name = 'XueGuYin.exe'\" | Where-Object { $_.CommandLine.Contains($env:XUEGUYIN_TEST_DATA_PATH) -and $_.CommandLine.Contains('--type=renderer') } | Select-Object -ExpandProperty CommandLine"], { env: { ...env, XUEGUYIN_TEST_DATA_PATH: dataPath } });
    expect(processes.stdout).toContain("--enable-sandbox");
    expect(processes.stdout).not.toContain("--no-sandbox");
    expect(await page.evaluate(() => typeof Reflect.get(window, "require"))).toBe("undefined");
    return page;
  }

  async function close() {
    try {
      const pages = browser?.contexts().flatMap((context) => context.pages()) || [];
      for (const page of pages) await page.close();
      if (exited) await Promise.race([exited, new Promise((_, reject) => setTimeout(() => reject(new Error("Portable app did not exit")), 15_000))]);
    } finally {
      await browser?.close();
      browser = undefined;
      if (child?.pid && child.exitCode === null) {
        await execute("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"]).catch(() => {});
      }
      child = undefined;
      exited = undefined;
    }
  }

  async function loadSavedGame(page: Page, snapshot: string) {
    expect(await page.evaluate((key) => localStorage.getItem(key), saveKey)).toBe(snapshot);
    expect(await page.evaluate(() => localStorage.getItem("xue-gu-yin-theme"))).toBe("dark");
    await page.getByRole("button", { name: /^读取存档/ }).click();
    await page.locator(".save-slot").first().getByRole("button", { name: "读取", exact: true }).click();
    await expect(page.getByLabel("血蛊引游戏界面")).toHaveAttribute("data-scene-id", "gate");
  }

  try {
    let page = await launch(original);
    // Launching the same portable EXE twice must not erase the first instance's
    // extracted resources before Electron's single-instance lock takes effect.
    const duplicate = spawn(path.join(original, "血蛊引.exe"), [], { stdio: "ignore", windowsHide: true });
    try {
      await expect.poll(() => duplicate.exitCode, { timeout: 60_000 }).toBe(0);
      await page.reload();
      await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
      expect(browser!.contexts()[0].pages()).toHaveLength(1);
    } finally {
      if (duplicate.pid && duplicate.exitCode === null) await execute("taskkill.exe", ["/PID", String(duplicate.pid), "/T", "/F"]).catch(() => {});
    }
    // Test the first-party page under offline emulation without changing the host network.
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: "血蛊引" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("portable-home.png") });
    await page.getByRole("button", { name: /^游戏设置/ }).click();
    await page.getByRole("button", { name: "暗色", exact: true }).click();
    await page.getByRole("button", { name: "返回", exact: true }).click();
    await page.getByRole("button", { name: /^开始游戏/ }).click();
    await page.getByRole("button", { name: /流浪剑修/ }).click();
    const cg = page.locator(".vn-scene-cg");
    await expect(cg.locator(".vn-scene-cg-title small")).toHaveText("Chapter 1-1");
    await expect(cg.locator(".vn-scene-cg-title strong")).toHaveText("夜雨墓门");
    await expect(cg.locator("img")).toHaveJSProperty("complete", true);
    await expect(cg.locator("img")).not.toHaveJSProperty("naturalWidth", 0);
    await page.screenshot({ path: testInfo.outputPath("portable-cg.png") });
    await cg.click();
    await expect(cg).toBeHidden();
    await expect(page.locator(".vn-stage")).toHaveAttribute("data-asset-key", "background.gate-empty");
    await page.getByRole("button", { name: /^快存/ }).click();
    await expect(page.getByText("快速存档完成")).toBeVisible();
    await page.getByRole("button", { name: "打开游戏菜单" }).click();
    await page.getByRole("dialog", { name: "游戏菜单" }).locator(".save-slot").first().getByRole("button", { name: "存入" }).click();
    const saved = await page.evaluate((key) => localStorage.getItem(key), saveKey);
    expect(JSON.parse(saved!)[0].game.sceneId).toBe("gate");
    await page.getByRole("button", { name: "关闭游戏菜单" }).click();
    await page.screenshot({ path: testInfo.outputPath("portable-game.png") });
    const audio = await page.evaluate(async () => {
      const response = await fetch("/audio/bgm-tomb-depths-v1.wav");
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(await response.arrayBuffer());
      const result = { status: response.status, seconds: decoded.duration };
      await context.close();
      return result;
    });
    expect(audio.status).toBe(200);
    expect(audio.seconds).toBeGreaterThan(0);
    expect(failures).toEqual([]);
    expect(remoteRequests).toEqual([]);
    // Renderer cannot open remote windows or make HTTP requests.
    expect(await page.evaluate(() => window.open("https://example.com") === null)).toBe(true);
    expect(await page.evaluate(async () => {
      try { await fetch("https://example.com"); return false; } catch { return true; }
    })).toBe(true);
    await close();
    page = await launch(original);
    await loadSavedGame(page, saved!);
    await close();
    // Copy the entire portable folder to simulate moving it to another disk/USB drive.
    await cp(original, moved, { recursive: true });
    page = await launch(moved);
    await loadSavedGame(page, saved!);
    await page.screenshot({ path: testInfo.outputPath("portable-moved-save.png") });
    await close();
    expect(failures).toEqual([]);
    const profileFiles = await readdir(path.join(moved, "血蛊引-data"));
    expect(profileFiles).toContain("Local Storage");
    await testInfo.attach("summary", { body: Buffer.from(JSON.stringify({ executable, original, moved, audio, failures, profileFiles, savedScene: "gate", launches: 3 }, null, 2)), contentType: "application/json" });
    // The test never reads or overwrites a real player's data directory.
    const digest = async (file: string) => createHash("sha256").update(await readFile(file)).digest("hex");
    expect(await digest(path.join(moved, "血蛊引.exe"))).toBe(await digest(executable));
  } finally {
    await close();
  }
});
