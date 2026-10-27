param(
  [string]$DshExecutable = 'E:\Dev\Toolchains\DeepSeek\DeepSeek Harness.exe',
  [int]$Port = 5493,
  [string[]]$ExtraBundlePath = @()
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previewHome = Join-Path $projectRoot '.cache/preview-dsh'
$profileDir = Join-Path $previewHome 'profiles/prompt-enhance-test'
$runtime = Join-Path (Split-Path -Parent $DshExecutable) 'resources/app.asar/dsh/node_modules/@deepseek-ai/dsh/lib/bin.js'
if (!(Test-Path -LiteralPath $DshExecutable)) { throw "DSH executable not found: $DshExecutable" }
if (!(Test-Path -LiteralPath (Join-Path $projectRoot 'lib/client.js'))) { throw 'Run npm run build first.' }
$previousHome = $env:DSH_HOME
$previousElectron = $env:ELECTRON_RUN_AS_NODE
try {
  $env:DSH_HOME = $previewHome
  $env:ELECTRON_RUN_AS_NODE = '1'
  if (!(Test-Path -LiteralPath (Join-Path $profileDir 'package.json'))) {
    & $DshExecutable $runtime --profile prompt-enhance-test --from-default-profile web --dump-config | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not initialize isolated DSH profile.' }
  }
  $manifestPath = Join-Path $profileDir 'package.json'
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  $modules = Join-Path $profileDir 'node_modules'
  New-Item -ItemType Directory -Force -Path $modules | Out-Null
  foreach ($bundlePath in (@($projectRoot) + $ExtraBundlePath)) {
    $bundleRoot = (Resolve-Path -LiteralPath $bundlePath).Path
    $bundle = Get-Content -LiteralPath (Join-Path $bundleRoot 'package.json') -Raw | ConvertFrom-Json
    if ($bundle.name -notmatch '^[a-z0-9][a-z0-9._-]*$') { throw 'Preview helper accepts only unscoped local bundle names.' }
    $link = Join-Path $modules $bundle.name
    if (!(Test-Path -LiteralPath $link)) {
      New-Item -ItemType Junction -Path $link -Target $bundleRoot | Out-Null
    } elseif ((Get-Item -LiteralPath $link).Target -ne $bundleRoot) {
      throw "Existing bundle path differs; refusing to overwrite $link"
    }
    if ($manifest.dsh.profile.bundles -notcontains $bundle.name) {
      $manifest.dsh.profile.bundles += $bundle.name
    }
    $manifest.dependencies | Add-Member -NotePropertyName $bundle.name -NotePropertyValue "link:$bundleRoot" -Force
  }
  $manifest | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $manifestPath -Encoding utf8
  Write-Host "Isolated DSH home: $previewHome"
  & $DshExecutable $runtime --profile prompt-enhance-test --host 127.0.0.1 --port $Port --no-open | Out-Host
} finally {
  $env:DSH_HOME = $previousHome
  $env:ELECTRON_RUN_AS_NODE = $previousElectron
}
