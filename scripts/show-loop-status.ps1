[CmdletBinding()]
param()

$projectRoot = Split-Path -Parent $PSScriptRoot
$tasksPath = Join-Path $projectRoot 'loop/tasks.json'
$continuousLockPath = Join-Path $projectRoot 'loop/runtime/continuous.lock.json'
$lockPath = Join-Path $projectRoot 'loop/runtime/loop.lock.json'
$checkpointPath = Join-Path $projectRoot 'loop/runtime/checkpoint.json'
$logsPath = Join-Path $projectRoot 'loop/logs'

if (-not (Test-Path -LiteralPath $tasksPath)) {
    throw "找不到任务文件：$tasksPath"
}

$state = Get-Content -LiteralPath $tasksPath -Raw -Encoding utf8 | ConvertFrom-Json
$tasks = @($state.tasks)
$done = @($tasks | Where-Object status -eq 'done')
$pending = @($tasks | Where-Object status -eq 'pending')
$blocked = @($tasks | Where-Object status -eq 'blocked')
$branch = (& git -C $projectRoot branch --show-current).Trim()

Write-Host "Gu Mu loop: $($done.Count)/$($tasks.Count) done, $($pending.Count) pending, $($blocked.Count) blocked"
Write-Host "Branch: $branch"

if (Test-Path -LiteralPath $continuousLockPath) {
    try {
        $continuousLock = Get-Content -LiteralPath $continuousLockPath -Raw -Encoding utf8 | ConvertFrom-Json
        $continuousProcess = Get-Process -Id $continuousLock.pid -ErrorAction SilentlyContinue
        if ($null -ne $continuousProcess) {
            Write-Host "Continuous supervisor: running (PID $($continuousLock.pid), cycle $($continuousLock.cycle), model $($continuousLock.model))"
        }
        else {
            Write-Host "Continuous supervisor: stale lock (PID $($continuousLock.pid))"
        }
    }
    catch {
        Write-Host 'Continuous supervisor: unreadable lock file'
    }
}
else {
    Write-Host 'Continuous supervisor: stopped'
}

if (Test-Path -LiteralPath $lockPath) {
    try {
        $lock = Get-Content -LiteralPath $lockPath -Raw -Encoding utf8 | ConvertFrom-Json
        $process = Get-Process -Id $lock.pid -ErrorAction SilentlyContinue
        if ($null -ne $process) {
            if ([string]$lock.phase -eq 'preflight') {
                Write-Host "Supervisor: running preflight (PID $($lock.pid), model $($lock.model))"
            }
            else {
                Write-Host "Supervisor: running $($lock.phase) (PID $($lock.pid), deadline $($lock.deadline), model $($lock.model))"
            }
        }
        else {
            Write-Host "Supervisor: stale lock (PID $($lock.pid))"
        }
    }
    catch {
        Write-Host 'Supervisor: unreadable lock file'
    }
}
else {
    Write-Host 'Supervisor: stopped'
}

if (Test-Path -LiteralPath $checkpointPath) {
    try {
        $checkpoint = Get-Content -LiteralPath $checkpointPath -Raw -Encoding utf8 | ConvertFrom-Json
        Write-Host "Checkpoint: $($checkpoint.phase); task $($checkpoint.taskId); outcome $($checkpoint.outcome); updated $($checkpoint.updatedAt)"
        if (-not [string]::IsNullOrWhiteSpace([string]$checkpoint.stderrLog)) {
            Write-Host "Checkpoint log: $($checkpoint.stderrLog)"
        }
    }
    catch {
        Write-Host 'Checkpoint: unreadable'
    }
}

if ($blocked.Count -gt 0) {
    Write-Host 'Blocked tasks:'
    $blocked | ForEach-Object { Write-Host "  $($_.id) $($_.title)" }
}
elseif ($pending.Count -gt 0) {
    $doneIds = @($done | ForEach-Object id)
    $next = $pending | Where-Object {
        $ready = $true
        foreach ($dependency in @($_.dependsOn)) {
            if ($dependency -notin $doneIds) {
                $ready = $false
                break
            }
        }
        $ready
    } | Select-Object -First 1

    if ($null -ne $next) {
        Write-Host "Next ready task: $($next.id) $($next.title)"
    }
}

if (Test-Path -LiteralPath $logsPath) {
    $latestLogs = Get-ChildItem -LiteralPath $logsPath -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 4
    if (@($latestLogs).Count -gt 0) {
        Write-Host 'Latest logs:'
        $latestLogs | ForEach-Object { Write-Host "  $($_.Name)" }
    }
}
