# 《血蛊引》受控 Codex CLI Loop

这个 Loop 在 Windows 本地以“环境预检 + 两小时工作周期”推进美术优化、自动试玩与剧情校验。每个周期最多交付两个完整任务；未完成的目标由下一周期从结构化检查点、Git diff、日志和任务状态继续。两小时是一个可续接的交付周期，不再宣称单个周期完成全部目标。

## 常用命令

```powershell
pnpm loop:dry-run
pnpm loop:start
pnpm loop:status
pnpm loop:stop
```

启动后先用最多 20 分钟检查 pnpm store、冻结安装、Playwright Chromium 和快速质量门禁；预检通过后才开始两小时计时。默认固定 `gpt-5.6-sol`，每个语义任务尝试最多 50 分钟，每周期最多三次语义尝试、两个完成任务，并允许两次不计入语义失败的基础设施重试。

可显式覆盖：

```powershell
pwsh -NoProfile -File .\scripts\run-loop.ps1 `
  -MaxTaskAttempts 3 `
  -MaxHours 2 `
  -IterationTimeoutMinutes 50 `
  -MaxCompletedTasksPerCycle 2 `
  -MaxInfrastructureRetries 2 `
  -PreflightTimeoutMinutes 20 `
  -ShutdownBufferSeconds 60 `
  -Model 'gpt-5.6-sol'
```

正常的新周期直接再次运行 `pnpm loop:start`，监督器会读取 `loop/runtime/checkpoint.json` 继续。只有同一周期的监督器异常退出时，才使用原来的带时区截止时间恢复，避免重新获得完整两小时：

```powershell
pwsh -NoProfile -File .\scripts\run-loop.ps1 `
  -HardDeadline '2026-08-28T18:00:00+08:00' `
  -AllowDirtyStart
```

## 工作分支

正常启动会从干净的 `master` 自动切换到 `automation/art-playtest-loop`。每个完成任务使用独立 Conventional Commit，并推送该专用分支；首次推送会建立 upstream，不会强推，也不会自动合并到 `master`。如果远端或认证阻止推送，当前任务不得标记为完成，必须把原因写入 `loop/progress.md`。

## 安全边界

- Codex 使用 `--approve-for-me` 自动审查；当前 CLI 会由该参数启用 `workspace-write` 沙箱，因此不再同时传入互斥的 `--sandbox` 参数，也不使用危险的沙箱绕过参数。
- 模型显式固定为 `gpt-5.6-sol`；如需变更必须通过 `-Model` 明确传入，不能静默继承本机默认值。
- 仅当前仓库可写；不创建账号、不购买服务、不发布应用、不合并生产分支。
- 初始工作区必须干净；恢复人工确认过的未完成改动时才使用 `-AllowDirtyStart`。
- 锁文件防止重复监督器；根目录 `stop.md` 请求当前轮结束后停止。
- 网络、registry 和 pnpm store 故障最多独立重试两次，不消耗语义任务失败次数；速率限制、额度不足或任务阻塞仍会停止循环，不切换账号或供应商。
- 美术必须原创或具有明确授权；禁止复制商业游戏素材、角色或 UI。
- “全流程无问题”只能由可复现测试、截图和日志支持，Loop 不得给出无证据的绝对保证。

## 恢复与审查

先运行 `pnpm loop:status`，查看检查点指向的日志，再检查 `loop/progress.md` 与 Git diff。预检已完成依赖与浏览器准备，工作轮次不得在清单未变化时重复运行安装。所有任务完成且 `pnpm verify` 通过时，Loop 才允许生成 `DONE.md`。
