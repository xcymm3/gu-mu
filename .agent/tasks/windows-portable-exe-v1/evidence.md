# Windows 便携版验证证据

验证时间：2026-09-03 09:41（Asia/Shanghai）。结论：AC1–AC5 全部 PASS。

## 当前产物

- 文件：`dist/desktop/XueGuYin-0.2.0-rc.2-win-x64-portable.exe`
- 大小：111,129,866 字节（约 106 MiB）
- SHA-256：`d63864c7acb073bc121474ce8a782c4b605a64c1e76dca7b0b7d41afde085543`
- 签名状态：`NotSigned`，已在使用文档中提示。
- `app.asar` 151,564 字节，只有 assets.mjs、main.mjs、storage.mjs、icon.ico、package.json；无 Next.js、React、node_modules、Loop 记录或测试存档。
- 内置静态导出 130 个文件，共 13,443,697 字节。外壳源码及图标与打包后的内容逐字节一致，见 `raw/artifact.json` 和 `raw/inspect-artifact.mjs`。

## 验收映射

| 标准 | 结果 | 当前证据 |
| --- | --- | --- |
| AC1 | PASS | `pnpm desktop:pack` 完整成功（含生产构建），见 `raw/desktop-pack.log`；EXE、运行时和资源完整 |
| AC2 | PASS | 对实际 portable EXE 使用离线模拟重新加载首页，公开操作进入角色、CG、正常阅读和保存；开场标题为 Chapter 1-1 夜雨墓门；本地 WAV 返回 200 并成功解码。见 `raw/desktop-report.json`、四张 PNG |
| AC3 | PASS | 三次实际启动：首次保存、关闭重启读取、复制 EXE 及数据目录到新路径后读取；存档内容和暗色设置保持一致。Chromium 数据在各自 EXE 旁的 `血蛊引-data`，不是临时解压目录。不可写路径由 storage 单测与主进程错误提示分支核验，不静默回退到 AppData |
| AC4 | PASS | 资源寻址／越界／NTFS 流／非法来源／请求方法单测；源码强制 sandbox/contextIsolation/webSecurity 并禁用 nodeIntegration；实际渲染进程参数包含 enable-sandbox，页面无 require，外部窗口及远端 fetch 被拒绝 |
| AC5 | PASS | 最终源码 103 项单测与 lint 成功；最终 EXE 构建含类型检查通过；实际 EXE 完整测试 78.46 秒，1 passed，0 skipped/failed/flaky；另有七 CG 与主菜单存读档的两项网页回归通过 |

## 新一轮复核

重新执行了 `pnpm test`、`pnpm lint`、`pnpm desktop:pack`、`pnpm test:desktop` 和两项网页回归，并检查当前 EXE 的散列及打包源码。最终桌面测试还在原窗口运行时再次启动同一 EXE，确认第二次启动正常退出、只有一个游戏页面、原窗口重新加载依然可用。实际运行路径使用每次独立的 `Temp/ns*.tmp/app`，避免共享解压目录互相删除资源。测试结束无遗留游戏进程。

`raw/unit-tests.log`、`raw/lint.log`、`raw/desktop-pack.log`、`raw/desktop-smoke.log`、`raw/web-smoke.log` 为最新命令结果；`raw/verify-fast.log` 记录此前完整快速门禁通过结果。测试副本、玩家数据和 EXE 本体不提交到 Git，只有证明材料进入任务目录。

## 已解决的构建／测试问题

1. 下载器旧依赖缺少 ElectronDownloadCacheMode：锁定 app-builder-lib 的 @electron/get 为 3.1.0。
2. 当前机器 Node 下载超时：通过镜像下载运行时，严格匹配 Electron 包自带 SHA-256 后填充缓存，再使用正式安装脚本；未关闭 TLS 或跳过校验。复现记录见 `raw/prepare-runtime.mjs`。
3. 打包器默认收集根项目依赖：使用独立 desktop 包和显式 node_modules 排除，并检查实际 ASAR 清单。
4. NSIS 不转发子进程调试输出：桌面测试使用测试启动时的随机本地调试端口连接真实 EXE，正常双击没有添加该测试参数。
5. 测试直接比较 111 MB Buffer 导致高内存：改成 SHA-256 比较，最终测试正常退出。
6. 打包器默认复用解压目录：按固定 26.15.3 的源码设置 unpackDirName=true，以重复启动回归确认资源不会被覆盖。

## 验证边界

本轮验证的是 Windows x64 打包与桌面集成，没有更改剧情或美术，也没有重新穷举全部四路线／九结局。已有核心合同测试及选定网页回归通过；未签名、手动升级、网页版存档独立属于明确告知的交付限制，不作为已解决的额外能力宣称。
