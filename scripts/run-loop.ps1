[CmdletBinding()]
param(
    [ValidateRange(1, 100)]
    [int]$MaxIterations = 8,

    [ValidateRange(1, 24)]
    [int]$MaxHours = 2,

    [ValidateRange(1, 60)]
    [int]$IterationTimeoutMinutes = 16,

    [ValidateRange(5, 300)]
    [int]$ShutdownBufferSeconds = 20,

    [string]$HardDeadline = '',

    [string]$Model = '',

    [string]$WorkBranch = 'automation/art-playtest-loop',

    [switch]$AllowDirtyStart,

    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$loopRoot = Join-Path $projectRoot 'loop'
$runtimeRoot = Join-Path $loopRoot 'runtime'
$logsRoot = Join-Path $loopRoot 'logs'
$tasksPath = Join-Path $loopRoot 'tasks.json'
$promptPath = Join-Path $loopRoot 'prompt.md'
$lockPath = Join-Path $runtimeRoot 'loop.lock.json'
$stopPath = Join-Path $projectRoot 'stop.md'
$donePath = Join-Path $projectRoot 'DONE.md'
$shutdownBuffer = [TimeSpan]::FromSeconds($ShutdownBufferSeconds)
$maxDuration = [TimeSpan]::FromHours($MaxHours)
$deadlineOverride = $null

if (-not [string]::IsNullOrWhiteSpace($HardDeadline)) {
    try {
        $deadlineOverride = [DateTimeOffset]::Parse($HardDeadline)
    }
    catch {
        throw 'HardDeadline 必须是带时区的 ISO 8601 时间，例如 2026-08-28T18:00:00+08:00。'
    }
}

function Read-TaskState {
    if (-not (Test-Path -LiteralPath $tasksPath)) {
        throw "找不到任务文件：$tasksPath"
    }

    return Get-Content -LiteralPath $tasksPath -Raw -Encoding utf8 | ConvertFrom-Json
}

function Get-ReadyTasks {
    param([Parameter(Mandatory)]$State)

    $doneIds = @($State.tasks | Where-Object status -eq 'done' | ForEach-Object id)
    $ready = @()
    foreach ($task in @($State.tasks)) {
        if ($task.status -ne 'pending') {
            continue
        }

        $dependenciesSatisfied = $true
        foreach ($dependency in @($task.dependsOn)) {
            if ($dependency -notin $doneIds) {
                $dependenciesSatisfied = $false
                break
            }
        }

        if ($dependenciesSatisfied) {
            $ready += $task
        }
    }

    return $ready
}

function Test-RateLimit {
    param([string[]]$Paths)

    $pattern = '(?i)(HTTP\s*429|status(?: code)?\s*429|too many requests|rate[- _]?limit (?:exceeded|reached)|usage[- _]?limit (?:exceeded|reached)|insufficient_quota|quota exceeded|额度已用尽|达到频率限制)'
    foreach ($path in $Paths) {
        if ((Test-Path -LiteralPath $path) -and
            (Select-String -LiteralPath $path -Pattern $pattern -Quiet -ErrorAction SilentlyContinue)) {
            return $true
        }
    }

    return $false
}

function Stop-ChildProcessTree {
    param([Parameter(Mandatory)][int]$ProcessId)

    if ($null -eq (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)) {
        return
    }

    & taskkill.exe /PID $ProcessId /T /F | Out-Null
}

function Set-SystemAwake {
    param([bool]$Enabled)

    if (-not ('GuMuLoop.PowerState' -as [type])) {
        Add-Type @'
using System;
using System.Runtime.InteropServices;
namespace GuMuLoop {
    public static class PowerState {
        [DllImport("kernel32.dll")]
        public static extern uint SetThreadExecutionState(uint esFlags);
    }
}
'@
    }

    if ($Enabled) {
        [void][GuMuLoop.PowerState]::SetThreadExecutionState([uint32]2147483649)
    }
    else {
        [void][GuMuLoop.PowerState]::SetThreadExecutionState([uint32]2147483648)
    }
}

function Assert-Prerequisites {
    foreach ($requiredPath in @($tasksPath, $promptPath)) {
        if (-not (Test-Path -LiteralPath $requiredPath)) {
            throw "缺少循环文件：$requiredPath"
        }
    }

    foreach ($commandName in @('codex', 'git', 'pnpm.cmd')) {
        if ($null -eq (Get-Command $commandName -ErrorAction SilentlyContinue)) {
            throw "找不到必需命令：$commandName"
        }
    }

    & git -C $projectRoot rev-parse --is-inside-work-tree 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw '项目必须是 Git 仓库。'
    }

    if ([string]::IsNullOrWhiteSpace((& git -C $projectRoot remote get-url origin 2>$null))) {
        throw '项目必须配置 origin 远端，Loop 才能留存每轮提交。'
    }
}

function Assert-LockAvailable {
    if (-not (Test-Path -LiteralPath $lockPath)) {
        return
    }

    try {
        $existing = Get-Content -LiteralPath $lockPath -Raw -Encoding utf8 | ConvertFrom-Json
        if ($null -ne (Get-Process -Id $existing.pid -ErrorAction SilentlyContinue)) {
            throw "已有 Loop 监督器正在运行（PID $($existing.pid)）。"
        }
    }
    catch {
        if ($_.Exception.Message -like '已有 Loop 监督器*') {
            throw
        }
    }

    Remove-Item -LiteralPath $lockPath -Force
}

function Ensure-WorkBranch {
    $currentBranch = (& git -C $projectRoot branch --show-current).Trim()
    if ($currentBranch -eq $WorkBranch) {
        return
    }

    if ($currentBranch -ne 'master') {
        throw "当前分支为 $currentBranch。请切回 master 或目标分支 $WorkBranch 后再启动。"
    }

    & git -C $projectRoot show-ref --verify --quiet "refs/heads/$WorkBranch"
    if ($LASTEXITCODE -eq 0) {
        & git -C $projectRoot switch $WorkBranch
    }
    else {
        & git -C $projectRoot ls-remote --exit-code --heads origin $WorkBranch 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            & git -C $projectRoot fetch origin $WorkBranch
            if ($LASTEXITCODE -ne 0) {
                throw "无法获取远端工作分支：$WorkBranch"
            }
            & git -C $projectRoot switch --track -c $WorkBranch "origin/$WorkBranch"
        }
        else {
            & git -C $projectRoot switch -c $WorkBranch
        }
    }

    if ($LASTEXITCODE -ne 0 -or ((& git -C $projectRoot branch --show-current).Trim() -ne $WorkBranch)) {
        throw "无法切换到专用工作分支：$WorkBranch"
    }
}

function Test-TaskDelivery {
    $dirty = @(& git -C $projectRoot status --porcelain)
    if ($dirty.Count -gt 0) {
        Write-Warning '任务标记为完成，但工作区仍有未提交改动。'
        return $false
    }

    $localSha = (& git -C $projectRoot rev-parse HEAD).Trim()
    $remoteLine = @(& git -C $projectRoot ls-remote origin "refs/heads/$WorkBranch")
    if ($LASTEXITCODE -ne 0 -or $remoteLine.Count -eq 0) {
        Write-Warning "任务标记为完成，但远端分支 $WorkBranch 不存在或不可访问。"
        return $false
    }

    $remoteSha = ($remoteLine[0] -split "`t")[0]
    if ($localSha -ne $remoteSha) {
        Write-Warning '任务标记为完成，但当前提交尚未推送到远端工作分支。'
        return $false
    }

    return $true
}

function Invoke-LoggedPnpm {
    param(
        [Parameter(Mandatory)][string[]]$Arguments,
        [Parameter(Mandatory)][string]$Name,
        [Parameter(Mandatory)][long]$TimeoutMilliseconds
    )

    if ($TimeoutMilliseconds -le 0) {
        throw "$Name 没有剩余执行时间。"
    }

    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $stdoutPath = Join-Path $logsRoot "$Name-$stamp.stdout.log"
    $stderrPath = Join-Path $logsRoot "$Name-$stamp.stderr.log"
    $process = Start-Process -FilePath 'pnpm.cmd' -ArgumentList $Arguments `
        -WorkingDirectory $projectRoot `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -WindowStyle Hidden `
        -PassThru
    $stopwatch = [Diagnostics.Stopwatch]::StartNew()

    while (-not $process.HasExited) {
        if ($stopwatch.ElapsedMilliseconds -ge $TimeoutMilliseconds) {
            Stop-ChildProcessTree -ProcessId $process.Id
            $process.WaitForExit()
            throw "$Name 超时，日志：$stdoutPath"
        }
        Start-Sleep -Milliseconds 500
        $process.Refresh()
    }

    if ($process.ExitCode -ne 0) {
        throw "$Name 失败（exit $($process.ExitCode)），日志：$stdoutPath"
    }
}

Assert-Prerequisites
$state = Read-TaskState
$tasks = @($state.tasks)
$readyTasks = @(Get-ReadyTasks -State $state)
$dirtyFiles = @(& git -C $projectRoot status --porcelain)
$currentBranch = (& git -C $projectRoot branch --show-current).Trim()

if ($DryRun) {
    Write-Host "Project: $projectRoot"
    Write-Host "Codex: $(& codex --version)"
    Write-Host "Tasks: $(@($tasks | Where-Object status -eq 'done').Count)/$($tasks.Count) done"
    Write-Host "Limits: $MaxIterations iterations, $MaxHours hours, $IterationTimeoutMinutes minutes per iteration, $ShutdownBufferSeconds seconds shutdown buffer"
    Write-Host "Branch: $currentBranch -> $WorkBranch when started"
    Write-Host 'Sandbox: workspace-write with automatic approval review'
    Write-Host "Working tree: $(if ($dirtyFiles.Count -eq 0) { 'clean' } else { "dirty ($($dirtyFiles.Count) entries)" })"
    if ($null -ne $deadlineOverride) {
        Write-Host "Hard deadline override: $($deadlineOverride.ToString('o'))"
    }
    if ($readyTasks.Count -gt 0) {
        Write-Host "Next ready task: $($readyTasks[0].id) $($readyTasks[0].title)"
    }
    else {
        Write-Host 'Next ready task: none'
    }
    exit 0
}

if (($dirtyFiles.Count -gt 0) -and (-not $AllowDirtyStart)) {
    throw '工作区不是干净状态。先提交现有改动；确需恢复已审查的残留状态时显式传入 -AllowDirtyStart。'
}

New-Item -ItemType Directory -Path $runtimeRoot, $logsRoot -Force | Out-Null
Assert-LockAvailable
Ensure-WorkBranch

if (Test-Path -LiteralPath $stopPath) {
    Remove-Item -LiteralPath $stopPath -Force
}

$startedAt = Get-Date
if ($null -ne $deadlineOverride) {
    $maxDuration = $deadlineOverride - [DateTimeOffset]::Now
    if ($maxDuration -le $shutdownBuffer) {
        throw 'HardDeadline 已到达或没有足够的清理缓冲时间。'
    }
    $displayDeadline = $deadlineOverride.LocalDateTime
}
else {
    $displayDeadline = $startedAt.AddHours($MaxHours)
}

$runStopwatch = [Diagnostics.Stopwatch]::StartNew()
@{
    pid = $PID
    startedAt = $startedAt.ToString('o')
    deadline = $displayDeadline.ToString('o')
    monotonicBudgetSeconds = [long]$maxDuration.TotalSeconds
    shutdownBufferSeconds = $ShutdownBufferSeconds
    project = $projectRoot
    branch = $WorkBranch
} | ConvertTo-Json | Set-Content -LiteralPath $lockPath -Encoding utf8

$basePrompt = Get-Content -LiteralPath $promptPath -Raw -Encoding utf8
$failureCounts = @{}
$iterationsStarted = 0

try {
    Set-SystemAwake -Enabled $true
    Write-Host "Loop started on $WorkBranch. Hard deadline: $($displayDeadline.ToString('yyyy-MM-dd HH:mm:ss'))"

    while ($iterationsStarted -lt $MaxIterations -and ($runStopwatch.Elapsed + $shutdownBuffer) -lt $maxDuration) {
        if (Test-Path -LiteralPath $stopPath) {
            Write-Host 'Stop requested; no new iteration will start.'
            break
        }

        if ((& git -C $projectRoot branch --show-current).Trim() -ne $WorkBranch) {
            throw "工作分支已离开 $WorkBranch，Loop 为保护仓库而停止。"
        }

        $state = Read-TaskState
        $blocked = @($state.tasks | Where-Object status -eq 'blocked')
        if ($blocked.Count -gt 0) {
            Write-Warning "任务已阻塞：$($blocked[0].id) $($blocked[0].title)"
            break
        }

        $readyTasks = @(Get-ReadyTasks -State $state)
        if ($readyTasks.Count -eq 0) {
            $pending = @($state.tasks | Where-Object status -eq 'pending')
            if ($pending.Count -gt 0) {
                throw '仍有待办任务，但依赖图中没有可执行任务。请检查 loop/tasks.json。'
            }

            Write-Host 'All tasks report done; running final verification.'
            $remaining = [long](($maxDuration - $runStopwatch.Elapsed - $shutdownBuffer).TotalMilliseconds)
            Invoke-LoggedPnpm -Arguments @('verify') -Name 'final-verify' -TimeoutMilliseconds $remaining
            $remaining = [long](($maxDuration - $runStopwatch.Elapsed - $shutdownBuffer).TotalMilliseconds)
            Invoke-LoggedPnpm -Arguments @('audit', '--prod', '--registry=https://registry.npmjs.org') -Name 'final-audit' -TimeoutMilliseconds $remaining

            if (-not (Test-Path -LiteralPath $donePath)) {
                throw '所有任务均已完成，但缺少 DONE.md 验收记录。'
            }
            if (-not (Test-TaskDelivery)) {
                throw '最终状态尚未完整提交并推送。'
            }

            Write-Host 'Loop goal complete.'
            break
        }

        $task = $readyTasks[0]
        $taskId = [string]$task.id
        $previousFailures = if ($failureCounts.ContainsKey($taskId)) { [int]$failureCounts[$taskId] } else { 0 }
        $mode = if ($previousFailures -ge 3) { 'diagnostic' } else { 'implementation' }
        $iterationsStarted++
        $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
        $prefix = '{0:D3}-{1}-{2}' -f $iterationsStarted, $taskId, $stamp
        $runtimePromptPath = Join-Path $runtimeRoot "$prefix-prompt.md"
        $stdoutPath = Join-Path $logsRoot "$prefix.stdout.log"
        $stderrPath = Join-Path $logsRoot "$prefix.stderr.log"

        $runtimePrompt = @"
$basePrompt

## 监督器运行上下文

- Iteration: $iterationsStarted / $MaxIterations
- Wall-clock deadline: $($displayDeadline.ToString('o'))
- Remaining time: $([math]::Max(0, [math]::Floor(($maxDuration - $runStopwatch.Elapsed).TotalMinutes))) minutes
- Branch: $WorkBranch
- Selected task: $taskId — $($task.title)
- Mode: $mode
- Consecutive incomplete runs: $previousFailures

只处理指定任务。在 diagnostic 模式下先检查重复失败；修复并提供证据，或在 loop/progress.md 与 loop/tasks.json 中以具体原因标记 blocked。
"@
        Set-Content -LiteralPath $runtimePromptPath -Value $runtimePrompt -Encoding utf8

        $arguments = @(
            'exec',
            '--cd', $projectRoot,
            '--approve-for-me',
            '--sandbox', 'workspace-write',
            '--ephemeral',
            '--color', 'never'
        )
        if (-not [string]::IsNullOrWhiteSpace($Model)) {
            $arguments += @('--model', $Model)
        }
        $arguments += '-'

        $remainingBudget = [long](($maxDuration - $runStopwatch.Elapsed - $shutdownBuffer).TotalMilliseconds)
        if ($remainingBudget -le 0) {
            Write-Warning 'Global time budget is exhausted; no child process will start.'
            break
        }
        $iterationBudget = [long][math]::Min(
            [TimeSpan]::FromMinutes($IterationTimeoutMinutes).TotalMilliseconds,
            $remainingBudget
        )

        Write-Host "[$iterationsStarted/$MaxIterations] Starting $taskId $($task.title) with $([math]::Floor($iterationBudget / 60000)) minute(s) available"
        $child = Start-Process -FilePath 'codex' -ArgumentList $arguments `
            -WorkingDirectory $projectRoot `
            -RedirectStandardInput $runtimePromptPath `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath `
            -WindowStyle Hidden `
            -PassThru

        $iterationStopwatch = [Diagnostics.Stopwatch]::StartNew()
        $timedOut = $false
        while (-not $child.HasExited) {
            if ($iterationStopwatch.ElapsedMilliseconds -ge $iterationBudget) {
                $timedOut = $true
                Stop-ChildProcessTree -ProcessId $child.Id
                $child.WaitForExit()
                break
            }
            Start-Sleep -Milliseconds 500
            $child.Refresh()
        }

        if ($timedOut) {
            Write-Warning "$taskId exceeded its available time and was stopped."
        }
        if (Test-RateLimit -Paths @($stdoutPath, $stderrPath)) {
            Write-Warning 'Detected a usage or rate limit. Stopping without changing providers or accounts.'
            break
        }
        if ((-not $timedOut) -and $child.ExitCode -ne 0) {
            Write-Warning "Codex CLI exited with code $($child.ExitCode). Inspect: $stderrPath"
            break
        }

        $newState = Read-TaskState
        $sameTask = @($newState.tasks | Where-Object id -eq $taskId | Select-Object -First 1)
        if ($sameTask.Count -eq 1 -and $sameTask[0].status -eq 'done') {
            if (-not (Test-TaskDelivery)) {
                Write-Warning "$taskId lacks clean committed and pushed evidence. Stopping."
                break
            }
            $failureCounts[$taskId] = 0
            Write-Host "$taskId completed."
        }
        elseif ($sameTask.Count -eq 1 -and $sameTask[0].status -eq 'blocked') {
            Write-Warning "$taskId was marked blocked."
            break
        }
        else {
            $failureCounts[$taskId] = $previousFailures + 1
            Write-Warning "$taskId remains incomplete (attempt $($failureCounts[$taskId]))."
        }
    }

    if ($iterationsStarted -ge $MaxIterations) {
        Write-Warning "Reached maximum iteration count: $MaxIterations"
    }
    elseif (($runStopwatch.Elapsed + $shutdownBuffer) -ge $maxDuration) {
        Write-Warning "Reached wall-clock limit: $MaxHours hours"
    }
}
finally {
    $runStopwatch.Stop()
    try {
        Set-SystemAwake -Enabled $false
    }
    catch {
        Write-Warning "Failed to restore Windows execution state: $($_.Exception.Message)"
    }
    if (Test-Path -LiteralPath $lockPath) {
        Remove-Item -LiteralPath $lockPath -Force
    }
    Write-Host "Loop stopped after $iterationsStarted iteration(s)."
}
