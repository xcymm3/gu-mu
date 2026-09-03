import { app, BrowserWindow, dialog, Menu, net, protocol, session } from "electron";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createAssetHandler, GAME_URL, isGameUrl } from "./assets.mjs";
import { portableDataPath, prepareDataDirectory } from "./storage.mjs";

const directory = dirname(fileURLToPath(import.meta.url));
const webRoot = app.isPackaged ? resolve(process.resourcesPath, "web") : resolve(directory, "../out");
const dataDirectory = app.isPackaged
  ? portableDataPath(process.execPath, process.env.PORTABLE_EXECUTABLE_DIR)
  : resolve(directory, "../dist/desktop/dev-data");

try {
  prepareDataDirectory(dataDirectory);
  app.setPath("userData", dataDirectory);
  app.setPath("sessionData", dataDirectory);
} catch (error) {
  dialog.showErrorBox("无法保存游戏数据", `无法写入：${dataDirectory}\n请将 EXE 移到可写目录（例如桌面），再启动游戏。\n\n${error.message}`);
  app.exit(1);
}

app.enableSandbox();
protocol.registerSchemesAsPrivileged([{
  scheme: "xueguyin",
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
}]);

let window;
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (window?.isMinimized()) window.restore();
    window?.show();
    window?.focus();
  });

  app.whenReady().then(async () => {
    protocol.handle("xueguyin", createAssetHandler(webRoot, (url) => net.fetch(url)));
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ["http://*/*", "https://*/*", "ws://*/*", "wss://*/*"] },
      (_details, callback) => callback({ cancel: true }),
    );
    Menu.setApplicationMenu(null);
    window = new BrowserWindow({
      title: "血蛊引",
      width: 1280,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      backgroundColor: "#101a17",
      icon: resolve(directory, "icon.ico"),
      show: false,
      webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, webSecurity: true },
    });
    window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    window.webContents.on("will-navigate", (event, url) => {
      if (!isGameUrl(url)) event.preventDefault();
    });
    window.webContents.on("will-attach-webview", (event) => event.preventDefault());
    window.webContents.on("before-input-event", (event, input) => {
      if (input.type === "keyDown" && input.key === "F11") {
        event.preventDefault();
        window.setFullScreen(!window.isFullScreen());
      }
    });
    window.once("ready-to-show", () => window.show());
    window.on("closed", () => { window = undefined; });
    await window.loadURL(GAME_URL);
  }).catch((error) => {
    dialog.showErrorBox("游戏启动失败", `无法加载内置游戏资源，请重新获取完整的便携版。\n\n${error.message}`);
    app.quit();
  });
  app.on("before-quit", () => session.defaultSession.flushStorageData());
  app.on("window-all-closed", () => app.quit());
}
