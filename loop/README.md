# 《血蛊引》受控 Codex CLI Loop

这个 Loop 在 Windows 本地启动多个全新、短生命周期的 Codex CLI 会话，并以两小时硬截止推进美术优化、自动试玩与剧情校验。长期状态保存在 `tasks.json`、`progress.md`、测试证据和 Git 提交中；CLI 会话本身使用 `--ephemeral`，不会依赖上一轮上下文。

## 常用命令

```powershell
pnpm loop:dry-run
pnpm loop:start
pnpm loop:status
pnpm loop:stop
```

默认限制：最多 8 轮、总计 2 小时、单轮最多 16 分钟、预留 20 秒关闭缓冲。可显式覆盖：

```powershell
pwsh -NoProfile -File .\scripts\run-loop.ps1 `
  -MaxIterations 8 `
  -MaxHours 2 `
  -IterationTimeoutMinutes 16 `
  -ShutdownBufferSeconds 20
```

如监督器异常退出，使用原来的带时区截止时间恢复，避免重新获得完整两小时：

```powershell
pwsh -NoProfile -File .\scripts\run-loop.ps1 `
  -HardDeadline '2026-08-28T18:00:00+08:00' `
  -AllowDirtyStart
```

## 工作分支

正常启动会从干净的 `master` 自动切换到 `automation/art-playtest-loop`。每个完成任务使用独立 Conventional Commit，并推送该专用分支；首次推送会建立 upstream，不会强推，也不会自动合并到 `master`。如果远端或认证阻止推送，当前任务不得标记为完成，必须把原因写入 `loop/progress.md`。

## 安全边界

- Codex 使用 `--approve-for-me` 和 `workspace-write` 沙箱，不使用危险的沙箱绕过参数。
- 仅当前仓库可写；不创建账号、不购买服务、不发布应用、不合并生产分支。
- 初始工作区必须干净；恢复人工确认过的未完成改动时才使用 `-AllowDirtyStart`。
- 锁文件防止重复监督器；根目录 `stop.md` 请求当前轮结束后停止。
- 速率限制、额度不足、CLI 非零退出或任务阻塞都会停止循环，不切换账号或供应商。
- 美术必须原创或具有明确授权；禁止复制商业游戏素材、角色或 UI。
- “全流程无问题”只能由可复现测试、截图和日志支持，Loop 不得给出无证据的绝对保证。

## 恢复与审查

先运行 `pnpm loop:status`，再查看 `loop/logs/` 中最新日志和 `loop/progress.md`。确认残留改动安全后再恢复。所有任务完成且 `pnpm verify` 通过时，Loop 才允许生成 `DONE.md`。
