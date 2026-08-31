[CmdletBinding()]
param(
    [ValidateRange(1, 20)]
    [int]$MaxTaskAttemptsPerCycle = 3,

    [ValidateRange(1, 24)]
    [int]$CycleHours = 2,

    [ValidateRange(1, 60)]
    [int]$IterationTimeoutMinutes = 50,

    [ValidateRange(2, 20)]
    [int]$DeliveryBufferMinutes = 8,

    [ValidateRange(1, 10)]
    [int]$MaxInfrastructureRetries = 2,

    [ValidateRange(1, 60)]
    [int]$PreflightTimeoutMinutes = 20,

    [ValidateRange(5, 300)]
    [int]$ShutdownBufferSeconds = 60,

    [ValidateRange(3, 20)]
    [int]$MaxConsecutiveTaskFailures = 6,

    [ValidateRange(1, 10)]
    [int]$MaxConsecutiveCycleErrors = 3,

    [string]$Model = 'gpt-5.6-sol',

    [string]$WorkBranch = 'automation/art-playtest-loop',

    [switch]$AllowDirtyStart,

    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cycleScript = Join-Path $PSScriptRoot 'run-loop.ps1'
$tasksPath = Join-Path $projectRoot 'loop/tasks.json'
$runtimeRoot = Join-Path $projectRoot 'loop/runtime'
$checkpointPath = Join-Path $projectRoot 'loop/runtime/checkpoint.json'
$continuousLockPath = Join-Path $runtimeRoot 'continuous.lock.json'
$stopPath = Join-Path $projectRoot 'stop.md'
$pwshPath = Join-Path $PSHOME 'pwsh.exe'

function Read-LoopState {
    return Get-Content -LiteralPath $tasksPath -Raw -Encoding utf8 | ConvertFrom-Json
}

function Read-LoopCheckpoint {
    if (-not (Test-Path -LiteralPath $checkpointPath)) {
        return $null
    }

    try {
        return Get-Content -LiteralPath $checkpointPath -Raw -Encoding utf8 | ConvertFrom-Json
    }
    catch {
        Write-Warning "无法读取 Loop 检查点：$($_.Exception.Message)"
        return $null
    }
}

function Get-WorkingTreeFingerprint {
    $status = @(& git -C $projectRoot status --porcelain)
    if ($status.Count -eq 0) {
        return ''
    }

    $unstagedDiff = @(& git -C $projectRoot diff --binary --no-ext-diff)
    $stagedDiff = @(& git -C $projectRoot diff --cached --binary --no-ext-diff)
    $untrackedHashes = @()
    foreach ($relativePath in @(& git -C $projectRoot ls-files --others --exclude-standard)) {
        $absolutePath = Join-Path $projectRoot $relativePath
        if (Test-Path -LiteralPath $absolutePath -PathType Leaf) {
            $untrackedHashes += "$relativePath $((Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash)"
        }
    }

    $payload = @(
        $status
        '--unstaged--'
        $unstagedDiff
        '--staged--'
        $stagedDiff
        '--untracked--'
        $untrackedHashes
    ) -join "`n"
    $sha256 = [Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
        return [Convert]::ToHexString($sha256.ComputeHash($bytes)).ToLowerInvariant()
    }
    finally {
        $sha256.Dispose()
    }
}

function Test-CheckpointWorkingTreeMatch {
    param(
        $Checkpoint,
        [string[]]$DirtyFiles
    )

    if ($null -eq $Checkpoint -or $DirtyFiles.Count -eq 0) {
        return $false
    }
    if ([string]$Checkpoint.branch -ne $WorkBranch) {
        return $false
    }

    $currentHead = (& git -C $projectRoot rev-parse HEAD).Trim()
    if ([string]$Checkpoint.gitHead -ne $currentHead) {
        return $false
    }

    $expected = @($Checkpoint.dirtyFiles | Sort-Object)
    $actual = @($DirtyFiles | Sort-Object)
    if (@(Compare-Object -ReferenceObject $expected -DifferenceObject $actual).Count -ne 0) {
        return $false
    }
    if ([string]::IsNullOrWhiteSpace([string]$Checkpoint.dirtyFingerprint)) {
        return $false
    }

    return [string]$Checkpoint.dirtyFingerprint -eq (Get-WorkingTreeFingerprint)
}

function Get-CycleArguments {
    param(
        [bool]$ReusePreflight,
        [bool]$PermitDirtyStart,
        [bool]$IsDryRun
    )

    $arguments = @(
        '-NoLogo',
        '-NoProfile',
        '-File', $cycleScript,
        '-MaxTaskAttempts', $MaxTaskAttemptsPerCycle,
        '-MaxHours', $CycleHours,
        '-IterationTimeoutMinutes', $IterationTimeoutMinutes,
        '-DeliveryBufferMinutes', $DeliveryBufferMinutes,
        '-MaxInfrastructureRetries', $MaxInfrastructureRetries,
        '-MaxConsecutiveTaskFailures', $MaxConsecutiveTaskFailures,
        '-PreflightTimeoutMinutes', $PreflightTimeoutMinutes,
        '-ShutdownBufferSeconds', $ShutdownBufferSeconds,
        '-Model', $Model,
        '-WorkBranch', $WorkBranch
    )

    if ($ReusePreflight) {
        $arguments += '-SkipPreflight'
    }
    if ($PermitDirtyStart) {
        $arguments += '-AllowDirtyStart'
    }
    if ($IsDryRun) {
        $arguments += '-DryRun'
    }

    return $arguments
}

if ($DryRun) {
    & $pwshPath @(Get-CycleArguments -ReusePreflight $false -PermitDirtyStart $AllowDirtyStart.IsPresent -IsDryRun $true)
    exit $LASTEXITCODE
}

New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
if (Test-Path -LiteralPath $continuousLockPath) {
    try {
        $existingLock = Get-Content -LiteralPath $continuousLockPath -Raw -Encoding utf8 | ConvertFrom-Json
        if ($null -ne (Get-Process -Id $existingLock.pid -ErrorAction SilentlyContinue)) {
            throw "已有连续 Loop 正在运行（PID $($existingLock.pid)）。"
        }
    }
    catch {
        if ($_.Exception.Message -like '已有连续 Loop*') {
            throw
        }
    }
    Remove-Item -LiteralPath $continuousLockPath -Force
}

# 显式启动代表恢复执行，因此只在连续监督器启动时清理上一轮留下的停止请求。
if (Test-Path -LiteralPath $stopPath) {
    Remove-Item -LiteralPath $stopPath -Force
}

$cycleNumber = 0
$reusePreflight = $false
$consecutiveCycleErrors = 0

@{
    pid = $PID
    startedAt = (Get-Date).ToString('o')
    cycle = 0
    cycleHours = $CycleHours
    project = $projectRoot
    branch = $WorkBranch
    model = $Model
} | ConvertTo-Json | Set-Content -LiteralPath $continuousLockPath -Encoding utf8

try {
    while ($true) {
        $state = Read-LoopState
        $tasks = @($state.tasks)
        $blocked = @($tasks | Where-Object status -eq 'blocked')
        $checkpoint = Read-LoopCheckpoint

        if ($null -ne $checkpoint -and [string]$checkpoint.phase -eq 'goal-complete') {
            Write-Host 'Continuous Loop goal complete; no further cycle is needed.'
            exit 0
        }
        if ($blocked.Count -gt 0) {
            Write-Warning "Continuous Loop stopped because $($blocked[0].id) is explicitly blocked."
            exit 2
        }
        if (Test-Path -LiteralPath $stopPath) {
            Write-Host 'Continuous Loop received stop.md; no new cycle will start.'
            exit 0
        }

        $dirtyFiles = @(& git -C $projectRoot status --porcelain)
        $recoverableOutcomes = @('task-timeout', 'task-incomplete', 'infrastructure-failure', 'delivery-pending', 'delivery-failed')
        $checkpointOutcome = if ($null -ne $checkpoint) { [string]$checkpoint.outcome } else { '' }
        $checkpointMatches = Test-CheckpointWorkingTreeMatch -Checkpoint $checkpoint -DirtyFiles $dirtyFiles
        $permitDirtyStart = $AllowDirtyStart.IsPresent -or (
            $dirtyFiles.Count -gt 0 -and
            $checkpointMatches -and
            ($checkpointOutcome -in $recoverableOutcomes -or
                $checkpointOutcome -like 'cli-exit-*' -or
                $checkpointOutcome -like 'supervisor-error:*')
        )
        if ($dirtyFiles.Count -gt 0 -and -not $permitDirtyStart) {
            throw '连续 Loop 检测到未获准的工作区改动，已停止以避免覆盖用户文件。'
        }

        $cycleNumber++
        @{
            pid = $PID
            startedAt = (Get-Date).ToString('o')
            cycle = $cycleNumber
            cycleHours = $CycleHours
            project = $projectRoot
            branch = $WorkBranch
            model = $Model
        } | ConvertTo-Json | Set-Content -LiteralPath $continuousLockPath -Encoding utf8
        Write-Host "Starting continuous work cycle $cycleNumber; each cycle has a $CycleHours hour budget."
        $cycleArguments = Get-CycleArguments -ReusePreflight $reusePreflight -PermitDirtyStart $permitDirtyStart -IsDryRun $false
        & $pwshPath @cycleArguments
        $cycleExitCode = $LASTEXITCODE
        $checkpoint = Read-LoopCheckpoint
        if ($null -eq $checkpoint) {
            throw '工作周期结束后没有可读检查点。'
        }
        if ($cycleExitCode -ne 0) {
            $consecutiveCycleErrors++
            if ($consecutiveCycleErrors -ge $MaxConsecutiveCycleErrors) {
                Write-Warning "Continuous Loop stopped after $consecutiveCycleErrors consecutive supervisor errors; last outcome: $($checkpoint.outcome)"
                exit 2
            }
            Write-Warning "Work cycle $cycleNumber failed with exit code $cycleExitCode; retrying from its checkpoint ($consecutiveCycleErrors/$MaxConsecutiveCycleErrors)."
            Start-Sleep -Seconds 5
            continue
        }
        $consecutiveCycleErrors = 0
        $reusePreflight = $true

        if ([string]$checkpoint.phase -eq 'goal-complete') {
            Write-Host "Continuous Loop completed the full goal after $cycleNumber cycle(s)."
            exit 0
        }
        if (Test-Path -LiteralPath $stopPath) {
            Write-Host 'Continuous Loop received stop.md; no new cycle will start.'
            exit 0
        }

        $fatalOutcomes = @('rate-limit', 'task-blocked')
        $outcome = [string]$checkpoint.outcome
        if ($outcome -in $fatalOutcomes) {
            Write-Warning "Continuous Loop stopped on a non-recoverable outcome: $outcome"
            exit 2
        }
        if ($outcome -eq 'infrastructure-failure' -and [int]$checkpoint.infrastructureRetries -ge $MaxInfrastructureRetries) {
            Write-Warning 'Continuous Loop stopped after repeated infrastructure failures.'
            exit 2
        }
        if ([int]$checkpoint.consecutiveTaskFailures -ge $MaxConsecutiveTaskFailures) {
            Write-Warning "Continuous Loop stopped after $($checkpoint.consecutiveTaskFailures) consecutive failures on task $($checkpoint.taskId)."
            exit 2
        }

        Write-Host "Cycle $cycleNumber ended with outcome $outcome; continuing immediately with the next cycle."
    }
}
finally {
    if (Test-Path -LiteralPath $continuousLockPath) {
        Remove-Item -LiteralPath $continuousLockPath -Force
    }
}
