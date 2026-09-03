# 血蛊引 Android 离线版

完整游戏随 APK 打包：剧情和战斗脚本、立绘、无人物背景、全屏剧情 CG、结局 CG、字体、音频均来自本次 Next.js 静态导出。无需在线网站、额外下载或本地服务器；渲染仍使用手机自带的 Android System WebView，并不是将 React 重写成原生游戏引擎。

## 安装、存档与更新

- Android 6.0 / API 23 起，横屏、沉浸式全屏。建议使用更新过的系统 WebView；老旧 WebView 对现代 CSS/JavaScript 的支持可能不足。
- 应用未申请 `INTERNET` 权限。加载器使用虚拟 HTTPS 同源地址读取 APK 内文件；缺失文件直接报错，不回退在线网站，也不打开外部链接。
- 存档、设置和已读记录保存在应用私有 WebView 数据中，退出或重启保留，清除数据或卸载会删除；与 Chrome 浏览器存档不互通。
- 保留 `top.xcymm3.adv` 和 `https://adv.xcymm3.top/` 的存储标识，供同签名覆盖升级沿用旧 Android 外壳存档。这个 URL 仅为本地来源标识，不会联网访问。
- 覆盖安装必须使用相同签名。若提示签名冲突，不要为了安装而直接卸载旧版，以免丢失存档。
- 内容更新需重新构建并安装新 APK；网页更新不会改变已安装的离线内容。

## 构建

需要 Node.js 22、pnpm 11.9.0、JDK 17 或 21、Gradle 9.5.0、Android SDK Platform 36 及 Build Tools 36.1.0。将 `JAVA_HOME` 指向 JDK 17+，`ANDROID_HOME` 指向 SDK，Gradle 加入 PATH；也可使用忽略的 `android/local.properties` 指定 `sdk.dir`。

```bash
pnpm install --frozen-lockfile
pnpm android:pack
```

这会依次构建 `out/`、运行 Android 路径/MIME 单元测试和 lint、生成 `android/app/build/outputs/apk/debug/app-debug.apk`。Gradle 从 `out/` 直接打包 assets（特别保留 `_next` 目录）；未导出完整游戏时构建会失败。直接用 Android Studio 或 Gradle 构建前，同样必须先从项目根目录运行 `pnpm build`，避免打包旧内容。

GitHub Actions 的 **Android APK** 工作流会构建完整离线内容，产物名为 `xue-gu-yin-offline-debug-apk`。

## 签名边界

默认产物是 Android debug 签名的测试安装包，不是用于应用商店的正式发行包。Debug 构建允许通过已授权 ADB 调试 WebView，release 构建关闭。不同电脑/CI 的默认 debug 签名可能不同，因此不能保证互相覆盖安装。

正式发布需要保管好长期使用的 release keystore，并配置 Gradle release 签名；不要把私钥、密码或 `.jks` / `.keystore` 提交到仓库。本项目不会自动生成并声称提供正式签名。

## 离线实现与验证

使用 Android 官方推荐的 [WebViewAssetLoader](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content) 读取包内资源，禁用网络、文件及 content URL 访问。`OfflineGameAssets` 对外站、非 GET 请求和资源缺失返回明确错误；`GameAssetPath` 验证路径并设置脚本/图片/字体/音频 MIME。

构建后应核对 APK 内 assets 与 `out/` 的完整文件列表及 SHA-256，并在专用测试设备上断网冷启动，检查首页、CG 点击淡出、正文、音频、存档和强制停止后读档。不得用桌面浏览器测试冒充 Android 运行验证。

Windows 包完整性检查（PowerShell 7，需 `JAVA_HOME` / `ANDROID_HOME`）：

```powershell
pwsh -File scripts/verify-android-apk.ps1
```

自动运行测试只接受名为 `xueguyin-offline-test` 的专用 AVD，不操作实体手机。它会跳过该 AVD 的首次全屏教学提示、关闭 Wi-Fi/移动网络、覆盖安装测试 APK、重置该 AVD 内游戏测试存档，并验证重启后的读档。截图通过 Android 原生 `screencap` 获取，避免旧 WebView 的 CDP 截图影响画面：

```powershell
$env:ANDROID_TEST_SERIAL = 'emulator-5554' # 用 adb devices 确认专用 AVD 的实际序列号
pnpm test:android
```

结果及截图位于忽略目录 `test-results/android/`；安装包核对报告为 `test-results/android/apk-integrity.json`。请勿把真实玩家的存档放入该专用测试 AVD。
