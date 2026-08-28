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
- `Q` / `L`：快速存档／读取
- `Esc`：游戏菜单
- 鼠标右键：隐藏／恢复界面
- 滚轮向上／向下：历史记录／推进文本

自动播放与快进会在选项、战斗和覆盖层处暂停。快速存档独立于六个手动存档位，所有记录只保存在当前浏览器。

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

`android/` 目录包含锁定横屏、沉浸式全屏的原生 WebView 外壳，启动后直接加载 [https://adv.xcymm3.top](https://adv.xcymm3.top)。详细的 APK 下载、Android Studio 构建与发布签名说明见 [android/README.md](android/README.md)。
