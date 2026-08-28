[CmdletBinding()]
param()

$projectRoot = Split-Path -Parent $PSScriptRoot
$stopPath = Join-Path $projectRoot 'stop.md'
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'

Set-Content -LiteralPath $stopPath -Encoding utf8 -Value @"
# Stop requested

Requested at: $timestamp

监督器会等待当前 Codex CLI 轮次结束后停止；如果该轮超时，只终止对应子进程树。
"@

Write-Host "已写入停止请求：$stopPath"
