param(
    [string]$Apk = "android/app/build/outputs/apk/debug/app-debug.apk",
    [string]$ExportDirectory = "out",
    [string]$BuildTools,
    [string]$Report = "test-results/android/apk-integrity.json"
)
$ErrorActionPreference = 'Stop'
if (-not $BuildTools) {
    if (-not $env:ANDROID_HOME) { throw 'Set ANDROID_HOME or pass -BuildTools.' }
    $BuildTools = (Get-ChildItem -LiteralPath (Join-Path $env:ANDROID_HOME 'build-tools') -Directory |
        Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1).FullName
}
$taskApkPath = (Resolve-Path -LiteralPath $Apk).Path
$taskExportPath = (Resolve-Path -LiteralPath $ExportDirectory).Path
$taskAaptName = if ($IsWindows) { 'aapt.exe' } else { 'aapt' }
$taskSignerName = if ($IsWindows) { 'apksigner.bat' } else { 'apksigner' }
$taskManifest = & (Join-Path $BuildTools $taskAaptName) dump badging $taskApkPath
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect APK manifest.' }
if (($taskManifest -join "`n") -match 'android.permission.INTERNET') { throw 'APK must not request INTERNET.' }
if (($taskManifest -join "`n") -notmatch "package: name='top.xcymm3.adv'") { throw 'Unexpected application ID.' }
$taskSignature = & (Join-Path $BuildTools $taskSignerName) verify --verbose --print-certs $taskApkPath
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskZip = [IO.Compression.ZipFile]::OpenRead($taskApkPath)
try {
    $taskFiles = @(Get-ChildItem -LiteralPath $taskExportPath -Recurse -File)
    $taskEntries = @($taskZip.Entries | Where-Object { $_.FullName.StartsWith('assets/') -and $_.Name })
    $taskRows = foreach ($taskFile in $taskFiles) {
        $taskRelative = [IO.Path]::GetRelativePath($taskExportPath, $taskFile.FullName).Replace('\', '/')
        $taskEntry = $taskZip.GetEntry("assets/$taskRelative")
        if (-not $taskEntry) { throw "Missing APK asset: $taskRelative" }
        $taskStream = $taskEntry.Open()
        $taskHasher = [Security.Cryptography.SHA256]::Create()
        try {
            $taskPackedHash = [Convert]::ToHexString($taskHasher.ComputeHash($taskStream)).ToLowerInvariant()
        } finally {
            $taskStream.Dispose()
            $taskHasher.Dispose()
        }
        $taskSourceHash = (Get-FileHash -LiteralPath $taskFile.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($taskPackedHash -ne $taskSourceHash) { throw "Asset mismatch: $taskRelative" }
        [ordered]@{ path = $taskRelative; bytes = $taskFile.Length; sha256 = $taskSourceHash }
    }
    if ($taskEntries.Count -ne $taskFiles.Count) { throw 'APK contains unexpected additional assets.' }
    $taskReport = [ordered]@{
        status = 'PASS'
        apk = $taskApkPath
        bytes = (Get-Item -LiteralPath $taskApkPath).Length
        sha256 = (Get-FileHash -LiteralPath $taskApkPath -Algorithm SHA256).Hash.ToLowerInvariant()
        assetCount = $taskRows.Count
        assetBytes = ($taskFiles | Measure-Object Length -Sum).Sum
        manifest = $taskManifest
        signature = $taskSignature
        assets = @($taskRows)
    }
    $taskReportPath = [IO.Path]::GetFullPath($Report)
    New-Item -ItemType Directory -Force -Path ([IO.Path]::GetDirectoryName($taskReportPath)) | Out-Null
    $taskReport | ConvertTo-Json -Depth 6 | Out-File -LiteralPath $taskReportPath -Encoding utf8
    Write-Output "PASS: $($taskRows.Count) packaged assets match the static export. SHA-256: $($taskReport.sha256)"
} finally {
    $taskZip.Dispose()
}
