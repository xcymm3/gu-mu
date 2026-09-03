# 血蛊引

以蛊墓寻宝、结盟与背叛为核心的固定剧本视觉小说／轻量 RPG。项目使用 Next.js、React 与 pnpm。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 阅读操作

- `Enter` / `Space`：推进文本
- `A`：自动播放
- 按住 `Ctrl`：高速快进剧情
- 点击快捷栏“快进”：在安卓或触屏设备上切换高速快进
- `B`：历史记录
- `H`：隐藏／恢复界面
- `S` 或快捷栏「存读档」：直接打开存档界面
- `Esc`：游戏菜单
- 鼠标右键：隐藏／恢复界面
- 滚轮向上／向下：历史记录／推进文本

自动播放与快进会在选项、战斗和覆盖层处暂停。网页存档卡片显示章节、场景、角色和时间；六个槽位支持存入与读取，覆盖前需确认。旧快速存档作为「旧版存档」只读保留，Q / L 不再执行快速存取。网页版记录保存在当前浏览器，不跨设备同步；已发布的 EXE / APK 不随网页改动更新，其操作以对应版本为准。

剧情以完整句子和段落分页，宁可留白；仅当单句在当前对话框内也无法完整容纳时按分句降级。详见[分页与存档兼容规则](docs/NARRATIVE-PAGINATION.md)。

声音会在首次点击后启动。设置页可分别调整总音量、背景音乐、环境声音和界面／战斗音效，也可一键静音。背景音乐、环境声和音效均为仓库内原创本地资源，不依赖外部音频服务；加载或解码失败时会自动降级为轻量合成反馈，不阻断阅读。

## 验证

```bash
pnpm test
pnpm lint
pnpm build
```

首次运行真实浏览器测试前安装 Chromium：

```bash
pnpm install:e2e:browser
```

`pnpm test:e2e` 会先生成生产静态导出物，再使用 Chromium 自动试玩；`pnpm verify` 会在快速门禁通过后追加同一组浏览器测试。

## Android 应用

`android/` 目录包含锁定横屏、沉浸式全屏的离线应用。完整剧情、立绘、背景、CG、字体和音频都随 APK 打包，不需要联网或另行下载资源；仍使用 Android 系统 WebView 渲染。执行 `pnpm android:pack` 构建，环境、存档及签名说明见 [android/README.md](android/README.md)。

## Windows 便携版

在 Windows x64 上执行：

```bash
pnpm install
pnpm desktop:pack
pnpm test:desktop
```

生成物为 `dist/desktop/XueGuYin-<版本>-win-x64-portable.exe`。双击即可离线游玩，不需要安装 Node.js、浏览器或 Web 服务。使用、存档备份、构建依赖及测试说明见 [desktop/README.md](desktop/README.md)。
