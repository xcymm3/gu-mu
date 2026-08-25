# 血蛊引 Android 外壳

这是一个不内置剧情资源的原生 Android WebView 应用。启动后会立即进入横屏沉浸模式，并加载：

```text
https://adv.xcymm3.top/
```

网页端更新后，Android 应用无需重新发包。WebView 的 `localStorage` 会保存游戏设置、存档与已读记录，但它与手机 Chrome 的网站数据相互独立。

## 直接下载调试 APK

推送 `android/` 相关改动后，GitHub Actions 的 **Android APK** 工作流会自动构建。

1. 打开 GitHub 仓库的 **Actions** 页。
2. 进入最新一次 **Android APK** 运行。
3. 在 **Artifacts** 下载 `xue-gu-yin-debug-apk`。
4. 解压后将 `app-debug.apk` 发送到手机安装。

调试 APK 使用 Android 默认调试签名，适合自测或小范围分发，不应直接上架 Google Play。

## Android Studio 构建

环境要求：

- Android Studio Quail 3 或兼容版本
- JDK 17
- Android SDK 36
- Gradle 9.5.0

用 Android Studio 打开仓库中的 `android` 目录，完成 Gradle Sync 后运行 `app`。

命令行构建：

```bash
gradle -p android :app:lintDebug :app:assembleDebug
```

APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 正式发布

上架或长期分发前，需要你自己保管的 release keystore。不要把 `.jks` / `.keystore` 或密码提交到 Git。可以在 Android Studio 中使用 **Build > Generate Signed App Bundle or APK** 生成签名 AAB/APK。

当前配置：

- 应用 ID：`top.xcymm3.adv`
- 最低版本：Android 6.0 / API 23
- 目标版本：Android 16 / API 36
- 屏幕方向：`sensorLandscape`
- 明文 HTTP：禁止
- 站内链接：留在 WebView
- 站外 HTTP(S)、电话与邮件链接：交给系统应用
