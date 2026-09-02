param(
  [Parameter(Mandatory = $true)]
  [ValidateSet(
    "git-status", "git-status-final", "unit", "lint", "build", "e2e", "visual-e2e", "visual-e2e-equivalent", "visual-e2e-retry",
    "static-proof", "image-decode", "out-index", "json-parse",
    "file-hashes", "file-sizes", "forbidden-patterns", "proof-validator",
    "deadline-validator"
  )]
  [string]$Name
)

$ErrorActionPreference = "Continue"
$taskRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$rawRoot = Join-Path $taskRoot "raw"
$logFileName = switch ($Name) {
  "json-parse" { "evidence-json-parse.txt" }
  "proof-validator" { "proof-validation.txt" }
  default { "{0}.txt" -f $Name }
}
$logPath = Join-Path $rawRoot $logFileName
$metadataPath = Join-Path $rawRoot "command-metadata.json"
$startedAt = (Get-Date).ToUniversalTime().ToString("o")
$commandText = ""
$captured = [System.Collections.Generic.List[string]]::new()

function Invoke-Captured {
  param([scriptblock]$Action)
  & $Action 2>&1 | ForEach-Object {
    $line = $_.ToString()
    Write-Host $line
    $captured.Add($line)
  }
  return $LASTEXITCODE
}

switch ($Name) {
  "git-status" {
    $commandText = "git status --short"
    $exitCode = Invoke-Captured { git status --short }
  }
  "git-status-final" {
    $commandText = "git status --short (after evidence generation)"
    $exitCode = Invoke-Captured { git status --short }
  }
  "unit" {
    $commandText = "pnpm test"
    $exitCode = Invoke-Captured { pnpm test }
  }
  "lint" {
    $commandText = "pnpm lint"
    $exitCode = Invoke-Captured { pnpm lint }
  }
  "build" {
    $commandText = "pnpm build"
    $exitCode = Invoke-Captured { pnpm build }
  }
  "e2e" {
    $commandText = "pnpm test:e2e:run"
    $exitCode = Invoke-Captured { pnpm test:e2e:run }
  }
  "visual-e2e" {
    $commandText = "pnpm exec playwright test tests/e2e/visual-art-expansion.spec.ts --reporter=line"
    $exitCode = Invoke-Captured { pnpm exec playwright test tests/e2e/visual-art-expansion.spec.ts --reporter=line }
  }
  "visual-e2e-equivalent" {
    $commandText = "pnpm test:e2e:run -- tests/e2e/visual-art-expansion.spec.ts --reporter=line"
    $exitCode = Invoke-Captured { pnpm test:e2e:run -- tests/e2e/visual-art-expansion.spec.ts --reporter=line }
  }
  "visual-e2e-retry" {
    $commandText = "pnpm test:e2e:run -- tests/e2e/visual-art-expansion.spec.ts --reporter=line (retry after isolated timing failure)"
    $exitCode = Invoke-Captured { pnpm test:e2e:run -- tests/e2e/visual-art-expansion.spec.ts --reporter=line }
  }
  "static-proof" {
    $commandText = "pnpm proof:visual:static"
    $exitCode = Invoke-Captured { pnpm proof:visual:static }
  }
  "image-decode" {
    $commandText = "Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -Filter *.webp | ForEach-Object { magick identify -verbose `$_.FullName }"
    $exitCode = Invoke-Captured {
      $failed = $false
      Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -Filter *.webp | ForEach-Object {
        magick identify -verbose $_.FullName
        if ($LASTEXITCODE -ne 0) {
          $failed = $true
          Write-Error "ImageMagick decode failed: $($_.FullName)"
        }
      }
      if ($failed) { exit 1 }
    }
  }
  "out-index" {
    $commandText = "Test-Path -LiteralPath out/index.html"
    $exists = Test-Path -LiteralPath out/index.html
    $captured.Add($exists.ToString())
    Write-Host $exists
    $exitCode = if ($exists) { 0 } else { 1 }
  }
  "json-parse" {
    $commandText = "Get-Content -LiteralPath .agent/tasks/visual-art-expansion-v1/evidence.json -Encoding utf8 -Raw | ConvertFrom-Json | Out-Null"
    try {
      Get-Content -LiteralPath .agent/tasks/visual-art-expansion-v1/evidence.json -Encoding utf8 -Raw | ConvertFrom-Json | Out-Null
      $captured.Add("PASS: evidence.json is valid JSON.")
      Write-Host "PASS: evidence.json is valid JSON."
      $exitCode = 0
    } catch {
      $captured.Add($_.Exception.Message)
      Write-Host $_.Exception.Message
      $exitCode = 1
    }
  }
  "file-hashes" {
    $commandText = "Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Get-FileHash -Algorithm SHA256"
    $exitCode = Invoke-Captured { Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Get-FileHash -Algorithm SHA256 | Format-Table -AutoSize | Out-String -Stream }
  }
  "file-sizes" {
    $commandText = "Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Select-Object FullName,Length"
    $exitCode = Invoke-Captured { Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Select-Object FullName,Length | Format-Table -AutoSize | Out-String -Stream }
  }
  "forbidden-patterns" {
    $commandText = @'
rg -n 'placeholder|TODO|screenshot|kind:\s*['"]css['"]|\.svg|<canvas' lib features app public tests
'@
    $exitCode = Invoke-Captured { rg -n "placeholder|TODO|screenshot|kind:\s*['`"]css['`"]|\.svg|<canvas" lib features app public tests }
  }
  "proof-validator" {
    $commandText = "node scripts/validate-task-proof.mjs visual-art-expansion-v1"
    $exitCode = Invoke-Captured { node scripts/validate-task-proof.mjs visual-art-expansion-v1 }
  }
  "deadline-validator" {
    $commandText = 'python "C:\Users\86187\.codex\skills\deadline-carl\scripts\task_loop.py" validate --task-id visual-art-expansion-v1 --repo-root "D:\mydoc\React\gu-mu-wu-xiu" --artifact evidence'
    $exitCode = Invoke-Captured { python "C:\Users\86187\.codex\skills\deadline-carl\scripts\task_loop.py" validate --task-id visual-art-expansion-v1 --repo-root "D:\mydoc\React\gu-mu-wu-xiu" --artifact evidence }
  }
}

$finishedAt = (Get-Date).ToUniversalTime().ToString("o")
$header = @(
  "command=$commandText",
  "started_at=$startedAt",
  "finished_at=$finishedAt",
  "exit_code=$exitCode",
  ""
)
Set-Content -LiteralPath $logPath -Encoding utf8 -Value ($header + $captured)

$metadata = if (Test-Path -LiteralPath $metadataPath) {
  @(Get-Content -LiteralPath $metadataPath -Encoding utf8 -Raw | ConvertFrom-Json)
} else {
  @()
}
$metadata = @($metadata | Where-Object { $_.name -ne $Name }) + [pscustomobject]@{
  name = $Name
  command = $commandText
  started_at = $startedAt
  finished_at = $finishedAt
  exit_code = [int]$exitCode
  log = "raw/$logFileName"
}
Set-Content -LiteralPath $metadataPath -Encoding utf8 -Value ($metadata | ConvertTo-Json -Depth 5)
exit $exitCode
