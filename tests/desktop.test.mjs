import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { createAssetHandler, findExportedFile, GAME_URL, isGameUrl } from "../desktop/assets.mjs";
import { portableDataPath, prepareDataDirectory } from "../desktop/storage.mjs";

test("桌面资源只接受固定本地来源", () => {
  assert.equal(isGameUrl(GAME_URL), true);
  assert.equal(isGameUrl(`${GAME_URL}_next/static/main.js`), true);
  for (const url of ["https://game/", "file:///secret", "xueguyin://other/", "xueguyin://game:9/", "xueguyin://user@game/", "invalid"]) {
    assert.equal(isGameUrl(url), false, url);
  }
});

test("资源解析支持静态导出并拒绝路径越界及 NTFS 流", async () => {
  const directory = mkdtempSync(resolve(tmpdir(), "xueguyin-assets-"));
  try {
    mkdirSync(resolve(directory, "chapter"));
    writeFileSync(resolve(directory, "index.html"), "home");
    writeFileSync(resolve(directory, "chapter/index.html"), "chapter");
    assert.equal(findExportedFile(directory, "/"), resolve(directory, "index.html"));
    assert.equal(findExportedFile(directory, "/chapter/"), resolve(directory, "chapter/index.html"));
    for (const path of ["/../secret", "/%2e%2e/secret", "/%2e%2e%5csecret", "/C:/secret", "/index.html:secret", "/%00", "/%ZZ", "/missing", "relative"]) {
      assert.equal(findExportedFile(directory, path), null, path);
    }
    const handler = createAssetHandler(directory, async () => new Response("home"));
    const response = await handler(new Request(GAME_URL));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("Content-Security-Policy"), /connect-src 'self'/);
    assert.equal(await response.text(), "home");
    assert.equal((await handler(new Request(GAME_URL, { method: "POST" }))).status, 405);
    assert.equal((await handler(new Request("https://game/"))).status, 403);
    assert.equal((await handler(new Request(`${GAME_URL}missing`))).status, 404);
    assert.equal(await (await handler(new Request(GAME_URL, { method: "HEAD" }))).text(), "");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("便携数据独立于临时解压目录和 EXE 版本名", () => {
  const original = portableDataPath(resolve("temp/XueGuYin.exe"), resolve("portable"));
  assert.equal(original, resolve("portable/血蛊引-data"));
  assert.equal(original, portableDataPath(resolve("temp2/XueGuYin-v2.exe"), resolve("portable")));
  assert.equal(portableDataPath(resolve("unpacked/XueGuYin.exe")), resolve("unpacked/血蛊引-data"));
  const directory = mkdtempSync(resolve(tmpdir(), "xueguyin-data-"));
  try {
    prepareDataDirectory(resolve(directory, "data"));
    writeFileSync(resolve(directory, "not-a-directory"), "occupied");
    assert.throws(() => prepareDataDirectory(resolve(directory, "not-a-directory")));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("桌面包装只包含外壳和静态导出，沿用游戏版本", () => {
  const config = JSON.parse(readFileSync(new URL("../electron-builder.json", import.meta.url), "utf8"));
  const desktop = JSON.parse(readFileSync(new URL("../desktop/package.json", import.meta.url), "utf8"));
  const game = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(desktop.version, game.version);
  assert.equal(config.directories.app, "desktop");
  assert.deepEqual(config.extraResources, [{ from: "out", to: "web", filter: ["**/*"] }]);
  assert.deepEqual(config.win.target, [{ target: "portable", arch: ["x64"] }]);
  assert.equal(config.portable.requestExecutionLevel, "user");
  assert.equal(config.portable.unpackDirName, true);
  const main = readFileSync(new URL("../desktop/main.mjs", import.meta.url), "utf8");
  assert.match(main, /sandbox: true, contextIsolation: true, nodeIntegration: false, webSecurity: true/);
  assert.match(main, /app\.enableSandbox\(\)/);
});
