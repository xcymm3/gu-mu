# Android 离线 APK 验证证据

任务：`android-offline-apk-v1`。针对当前源码及本次实际导出、构建的 APK，不沿用旧在线外壳的结论。

## 交付物

- `dist/android/XueGuYin-0.2.0-rc.2-android-offline.apk`
- 大小：15,467,531 字节；SHA-256：`fe377ee0e977f6b9ed00b5045a256b0923b967def91e9d3887c743670a651655`
- 应用 ID：`top.xcymm3.adv`；版本：`0.2.0-rc.2-offline` / code 2；minSdk 23，targetSdk 36。
- Android debug 签名验证通过。安装包、本机 SDK 和构建缓存留在忽略目录，不提交私钥。

## 按验收标准核对

| 标准 | 结果 | 当前证据 |
| --- | --- | --- |
| AC1 | PASS | `raw/apk-integrity.json`：APK 内 130 个资源、13,443,697 字节与当前 `out/` 文件列表和逐文件 SHA-256 全部一致，无缺失或额外资源 |
| AC2 | PASS | 最终 APK 清单无 INTERNET；禁用网络、file/content 访问和外站导航；Android 实测缺失资源 404、外站读取失败 |
| AC3 | PASS | Android 15/API 35 专用模拟器断网运行：首页、横屏、Chapter 1-1 夜雨墓门 CG、点击回到无人背景、音频解码、快存和手动存档、强制停止后重启读档通过 |
| AC4 | PASS | 103 项 Node 测试、ESLint、TypeScript、Next 静态构建通过；3 项 Java 测试、Android lint 和 APK 构建通过；CI 与签名说明已调整 |
| AC5 | PASS | 冻结规格、原始输出、当前代码复核、最终 evidence/verdict/problems 均保存；本任务提交和推送结果以 Git 记录为准 |

## 复核命令与记录

1. `pnpm verify:fast`：通过，含 103 项测试、ESLint、生产静态导出，见 `raw/final-web-verification.log`。另运行 `pnpm exec tsc --noEmit`、`pnpm lint`，退出码均为 0，见 `raw/typescript.log`、`raw/lint.log`。
2. `gradle -p android :app:testDebugUnitTest :app:lintDebug :app:assembleDebug --offline --rerun-tasks`：20 秒成功，49 项任务执行，见 `raw/android-build.log`、`raw/android-unit-tests.xml`。
3. `pnpm test:e2e:run tests/e2e/playthrough.spec.ts --grep '七个剧情 CG|主菜单到读档工具链' --reporter=line`：2 项通过，19.4 秒，见 `raw/web-smoke.log`。这是网页回归，不替代 Android 实测。
4. `pnpm test:android`：1 项通过，57.5 秒，见 `raw/android-runtime.log`、`raw/android-runtime-report.json`。专用 `xueguyin-offline-test` AVD，Android 15/API 35、WebView 124.0.6367.219、Pixel 5 横屏 2340×1080；Wi-Fi 和移动网络关闭。
5. `scripts/verify-android-apk.ps1` 对最终 `dist/android/` 交付物再次验证：资源、清单、签名全部通过，见 `raw/apk-integrity.json`。

Android 检查还包含 origin/UA、CG 图片实际加载、WAV MIME 与解码时长、正文处于对话框内且不覆盖底栏、存档跨进程一致及无页面 JavaScript 异常。截图来自 Android 原生 `screencap`，已目视检查 `raw/android-home.png`、`raw/android-cg.png`、`raw/android-game.png`、`raw/android-restored.png`。

## 已处理的发现

首次复核发现 ESLint 扫描 Android 构建目录内复制的压缩脚本。已将 Android 构建输出和缓存加入全局忽略，并重新通过 Web 门禁、Android 构建、完整性核对和 Android 运行测试。

CDP 调试截图曾造成旧 WebView 合成画面偏移；DOM 几何与原生截图确认实际布局正确，测试改用原生截图，没有改动游戏 CSS。专用 AVD 首次全屏提示已由测试跳过；启动器 Quickstep 的系统对话框不是游戏崩溃。`raw/android-process-exits.txt` 所见游戏退出为测试主动 force-stop。

## 非阻断限制

- Android lint：0 个错误、11 个警告，完整保留于 `raw/android-lint.txt`。涉及既有横屏/不可调整窗口、Android 16 大屏适配建议、图标/备份建议、API 属性兼容及 SDK/WebKit 新版本提示。WebKit 1.15 有意保留 API 23 安装兼容。
- 实测 Android 15 模拟器，未声称完成实体手机、API 23 旧 WebView、Android 16 大屏或所有路线/九结局的 Android 全量游玩验证。最低安装版本不代表所有老 WebView 都支持当前 CSS/JavaScript。
- 完整离线内容仍由系统 WebView 渲染，不是原生引擎重写；后续内容变更需重新打包安装。
- 交付为 debug 签名测试版。不同电脑/CI 签名可能不同；覆盖升级需相同签名，卸载或清除数据会丢失存档。
- 重启读档属于新的 CG 观看会话，既有游戏可能再次播放该场景 CG；点击即可继续，本次不改变原有规则。
