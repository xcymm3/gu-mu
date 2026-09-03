# 血蛊引 Windows 便携版

## 使用

适用 Windows 10/11 x64。将 `XueGuYin-<版本>-win-x64-portable.exe` 放在有写入权限的目录，双击运行，无需安装。游戏图片、剧情、字体、音频与 Chromium 运行时都随 EXE 提供；不会加载在线游戏站点，也没有自动更新。

- `F11` 切换全屏，其他游戏按键与网页版相同。
- 第一次点击后启用声音；关闭窗口即可退出。
- EXE 启动时会解压运行时到系统临时目录，因此可能需要等待几秒并预留约 1 GB 可用空间；正常退出后启动器清理临时解压文件。
- 每次启动使用独立的临时解压目录，重复启动同一目录的游戏只会唤回已有窗口，不覆盖正在使用的资源。
- 当前构建未进行数字签名，Windows 可能提示未知发布者；这是免安装版，不会请求管理员权限或创建桌面快捷方式。对外正式发行前可另外配置代码签名。

## 存档、备份与升级

程序首次运行会在 **EXE 同一目录**创建 `血蛊引-data`，保存六个手动存档、快速存档、结局解锁及设置。使用固定的 `xueguyin://game/` 本地来源，版本文件名和临时解压位置变化不会改变存档来源。

备份、复制到 U 盘或迁移：先退出游戏，再把 EXE 和整个 `血蛊引-data` 文件夹一起复制。只复制 EXE 相当于新安装，不会带走进度。升级时保留数据文件夹，只替换 EXE。不要在运行中复制 Chromium 数据文件，也不要删除 `Local Storage` 子目录。

目录无法写入时会显示错误并退出；请换到可写位置，不会静默改存到 AppData。网页版／Android 版与此版本的记录互相独立，不会自动导入浏览器存档。普通异常断电仍可能影响最近尚未落盘的数据，请定期备份。

## 开发与构建

在仓库根目录使用 Node.js 22.12+ 和项目锁定的 pnpm：

```bash
pnpm install
pnpm desktop:dev
pnpm desktop:pack
```

`desktop:dev` 先构建静态页面，再下载开发运行时并启动外壳，开发存档独立保存在 `dist/desktop/dev-data`。

`desktop:pack` 先执行 Next.js 生产构建，再由 electron-builder 打包 Windows x64 portable EXE。首次构建需要联网下载工具和运行时；游戏运行无需网络。项目锁定 Electron/electron-builder 版本，并固定 `app-builder-lib` 使用 `@electron/get@3.1.0`，避免旧版下载器缺少 `ElectronDownloadCacheMode` 导致构建失败。发布版本时请同步根目录及 `desktop/package.json` 的版本号（单元测试会校验）。

`portable.unpackDirName: true` 按锁定的 electron-builder 26.15.3 实际实现选择每次启动独立的 `$PLUGINSDIR`；该版本文档的布尔说明与实现不一致，升级工具时必须重跑重复启动测试，不能仅按文档反转此值。

若当前网络不能下载 GitHub 大文件，可在当前 PowerShell 会话使用 Electron 官方文档列出的镜像，不关闭 TLS 或校验：

```powershell
$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
pnpm desktop:pack
```

EXE、解包目录、开发存档及测试副本均位于已忽略的 `dist/`、`test-results/` 中，不提交到 Git。`desktop/icon.ico` 由现有 `app/icon.svg` 转换，修改图标后可用 ImageMagick 重新生成：

```bash
magick -background none app/icon.svg -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 desktop/icon.ico
```

## 验证

```bash
pnpm verify:fast
pnpm desktop:pack
pnpm test:desktop
```

桌面测试针对**实际 portable EXE**，使用独立测试目录进行离线首页、CG 标题、正常阅读、本地音频解码、保存、退出重启和移动目录读档验证，同时检查渲染器沙箱与 Node 隔离。截图和运行记录写入 `test-results/desktop`，不读取玩家存档。可用环境变量 `DESKTOP_EXE` 指向待测 EXE。

技术依据：[Electron 自定义协议](https://www.electronjs.org/docs/latest/api/protocol)、[portable 打包选项](https://www.electron.build/docs/api/app-builder-lib.interface.portableoptions/)。
