# 《血蛊引》Loop 进度

该文件只追加每轮的可复现证据。任务状态以 `loop/tasks.json` 为准。

## 2026-08-28 · 监督器基线准备

- 参照 `D:\mydoc\React\voxelcraft` 的受控 Loop 结构，确定两小时硬截止、每轮全新上下文、单任务提交和失败留证原则。
- 为美术、浏览器自动试玩、全路线结局、剧情连续性与最终回归建立依赖任务图。
- `pnpm loop:dry-run` 通过：识别 7 个任务、两小时硬截止、16 分钟单轮超时、专用分支与 `workspace-write` 沙箱。
- `pnpm loop:status` 通过：可读取任务依赖、当前分支、监督器状态和下一就绪任务。
- `pnpm loop:stop` 通过：可生成带时间戳的优雅停止请求；测试请求随后已清理。
- `pnpm verify:fast` 通过：86 项 Node 测试、ESLint、TypeScript 与 Next.js 生产构建全部成功。
- `pnpm audit --prod --registry=https://registry.npmjs.org` 当前退出码为 1：`next > postcss > nanoid` 命中 `GHSA-2v37-7h3g-55p8` high 风险；该项保留给最终回归任务处理，未通过前不得生成 `DONE.md`。
- `GM2H-000` 已完成；下一就绪任务为真实浏览器自动试玩基础设施。

## 2026-08-28 · 首次启动兼容性修正

- 首轮启动日志显示 Codex CLI 0.150.0-alpha.8 不允许同时传入 `--approve-for-me` 与 `--sandbox workspace-write`，进程以退出码 2 停止，未修改游戏文件。
- 删除冗余的 `--sandbox` 参数；`--approve-for-me` 本身会使用 `workspace-write` 沙箱，保留自动审批审查与仓库写入边界。
- 无改动 CLI 探针最终返回 `READY`，并确认参数组合实际启用 `sandbox: workspace-write`；WebSocket 超时后可自动回退 HTTPS。

## 2026-08-28 · GM2H-001 真实浏览器自动试玩基础设施

- 引入 Playwright Chromium、生产静态导出服务器与两项公开操作 E2E；`pnpm verify` 已纳入真实浏览器门禁。
- 自动覆盖主菜单、身份选择、正文推进、八次共通线选择、首场战斗、设置、历史、手动存读档及快速存读档。
- 浏览器夹具将页面异常、`console.error`、失败请求、HTTP 4xx/5xx 和文档全局横纵溢出作为失败；未通过直接写入最终状态缩短流程。
- `pnpm install --frozen-lockfile` 退出码 0；随后 `pnpm test:e2e:run` 退出码 0，2 项 Chromium 用例通过（23.5 秒）。
- `pnpm verify:fast` 退出码 0：86 项 Node 测试、ESLint、TypeScript 与 Next.js 生产静态构建通过。
- `pnpm verify` 退出码 0：完整快速门禁后，2 项 Chromium 用例再次通过（29.8 秒）。

## 2026-08-28 · 两小时工作周期重构

- 将两小时定义为可续接工作周期：计时前最多 20 分钟环境预检，周期内最多交付两个任务、三次语义任务尝试，每次最多 50 分钟并预留 60 秒清理。
- 模型显式固定为 `gpt-5.6-sol`；Codex CLI 0.150.0-alpha.12.2 探针确认 `workspace-write` 沙箱并返回 `READY`。
- 新增 `loop/runtime/checkpoint.json` 结构化恢复点；运行模式区分 implementation、resume 与 diagnostic，优先复用 Git diff 和上轮日志。
- 网络、registry、pnpm store 与模型传输故障最多独立重试两次，不再计入语义任务失败；工作轮次禁止在依赖清单未变化时重复安装。
- 预检命令均通过：`pnpm store status`、`pnpm install --frozen-lockfile --prefer-offline`、`pnpm exec playwright install chromium` 与 `pnpm verify:fast`；86 项测试、Lint、TypeScript 和生产构建成功。

## 2026-08-28 · GM2H-002 全路线与全部结局自动试玩

- 新增共享引擎镜像驱动，但所有身份、剧情选择、战斗蛊术、存档和读取仍通过 Chromium 中的玩家可见按钮完成；未直接写入最终状态。
- 四条正式路线均由真实页面通关；三种身份分别实际使用回春蛊、剑鸣蛊与惑心蛊，并验证游方蛊医无法击败苏衍、世家之子可进入真结局。
- 固定 `Math.random` 为 `0.75` 并核对机关暗室的血刃蛊结果；新增大雾等待选项，使原本仅由结算器登记的“困于蛊墓”拥有公开可玩路径。
- 赵黎线在血傀儡、赵黎与乔无咎战前通过页面手动存档；每场先验证战败结局，再从存档页读取同一状态并验证胜利，连同四个路线结局与苏衍战败覆盖全部 9 个登记结局。
- `pnpm exec playwright test tests/e2e/full-routes.spec.ts --reporter=line` 退出码 0：6 项全路线 Chromium 用例通过（2.8 分钟）。
- `pnpm verify:fast` 退出码 0：87 项 Node 测试、全仓 ESLint、TypeScript 与生产静态构建通过。
- `pnpm verify` 退出码 0：快速门禁再次通过，8 项 Chromium 用例全部通过（3.0 分钟）；页面错误、`console.error`、失败请求和 HTTP 4xx/5xx 均未触发。

## 2026-08-28 · GM2H-003 视觉基线与可访问性修复

- 生成并目视复核 18 张可复现 PNG：覆盖主菜单、设置、存档、身份选择、普通／多人对白、三选项、手动存档、历史、战斗、结局，以及 1280×720、1366×768、1920×1080、390×844 竖屏提示和 844×390 横屏舞台。
- 修复选择结果与战斗结算长文本未分页、设置列表滚动提示、结局与快捷栏 `100vw` 溢出风险、横屏安全区和核心触控区不足；直接颜色提升为语义 token，并将 Hallmark 的无证据 `pass` 声明替换为可执行视觉测试路径。
- 游戏菜单、历史和蛊斗帮助补齐初始焦点、Tab／Shift+Tab 焦点陷阱、Esc 关闭和关闭后焦点恢复；浏览器测试验证焦点环、关键 token 对比度、减少动态、44×44 触控区、全局／对白溢出和可见控件边界。
- `pnpm exec playwright test tests/e2e/visual-baseline.spec.ts --reporter=line` 退出码 0：3 项视觉与无障碍用例通过（1.2 分钟）；旧全路线分页断言专项复现退出码 0（1 项通过，48.7 秒）。
- `pnpm verify:fast` 退出码 0：87 项 Node 测试、ESLint、TypeScript 与 Next.js 生产构建通过。
- `pnpm verify` 退出码 0：11 项 Chromium 用例全部通过（4.8 分钟），未出现页面错误、`console.error`、失败资源请求、HTTP 4xx/5xx 或已知布局阻断。

## 2026-08-28 · 连续监督器修正

- 移除“每周期最多完成两个任务”的硬停止条件；完成任务数量不再结束 Loop。
- 新增连续监督器：两小时仅作为滚动周期预算，周期到时或三次语义尝试用尽后立即从检查点进入下一周期，直到 7/7 验收完成。
- 首个周期执行环境预检，后续周期复用结果，避免重复安装依赖和 Chromium；保留单任务 50 分钟、停止文件、双层互斥锁、速率限制和故障阈值。
- `pnpm loop:start` 改为连续入口，底层单周期诊断保留为 `pnpm loop:cycle`；`pnpm loop:status` 同时显示连续监督器与当前工作周期。

## 2026-08-28 · GM2H-004 背景立绘与声音资源统一

- 使用 Codex 内置 imagegen 生成第二幕蛊墓甬道并转为 `1672×941`、58,252 字节 WebP；资源清单不再包含 CSS 开发占位背景，主菜单改为复用剧情同款纪清寒正式透明立绘。
- 新增 3 条配乐、3 条环境声与 7 条界面／战斗原创 WAV，总计 2,462,236 字节；默认从本地文件解码播放，加载或解码失败时保留 Web Audio 合成回退，来源与生成脚本记录于 `docs/asset-sources.md`。
- 发布资源测试验证全部登记舞台均为图片、视觉资源单文件／4.5 MB 总预算，以及音频 PCM 编码、采样率、峰值、RMS、时长、单文件／2.6 MB 总预算和失败回退。
- `pnpm test:e2e:run tests/e2e/visual-baseline.spec.ts --reporter=line` 退出码 0：3 项用例通过（1.1 分钟）；目视复核主菜单、设置、三选项、战斗及 1280×720、1366×768、1920×1080、844×390 截图，未发现裁切、遮挡或风格阻断。
- `pnpm verify` 退出码 0：90 项 Node 测试、ESLint、TypeScript、Next.js 生产静态构建与 11 项 Chromium 用例全部通过（浏览器阶段 8.1 分钟），未出现页面错误、`console.error`、失败资源请求或 HTTP 4xx/5xx。

## 2026-08-28 · GM2H-005 剧情连续性审查

- 逐节点审查四条正式路线的动机、信息来源、位置、伤势、道具与旗标；修正开场实际六人却写成五人、纪清寒线正文显示转义符，以及乔无咎线场景位置与薛逢死亡／牵机副印状态脱节，未扩大路线或整线重写。
- `story-flow` 与发布清单现与代码中的标题、`v0.2.0-rc.1` 版本、四条正式路线和 9 个登记结局一致；新增路线连续性和文档合同测试。
- 标准验证重新生成 8 张主菜单／开场对白基线图；目视复核 1366×768 桌面与 844×390 手机横屏代表图，六人文案可读且未出现裁切、遮挡或溢出。
- `pnpm test` 退出码 0：92 项 Node 测试通过；`pnpm verify` 退出码 0：92 项测试、ESLint、TypeScript、Next.js 生产静态构建与 11 项 Chromium 用例全部通过（浏览器阶段 6.6 分钟），页面错误、`console.error`、失败请求和 HTTP 4xx/5xx 门禁均未触发。
