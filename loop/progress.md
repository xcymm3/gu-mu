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
