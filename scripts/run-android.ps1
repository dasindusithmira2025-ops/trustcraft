$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$sdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { 'C:\Android\Sdk' }
$adb = Join-Path $sdkRoot 'platform-tools\adb.exe'

& (Join-Path $PSScriptRoot 'start-emulator.ps1')
$deviceLine = & $adb devices | Select-String '^emulator-\d+\s+device$' | Select-Object -First 1
if (-not $deviceLine) { throw 'No ready Android emulator was found.' }
$serial = $deviceLine.ToString().Split("`t")[0]
Push-Location (Join-Path $repositoryRoot 'mobile')
try {
  flutter pub get
  flutter run -d $serial
} finally {
  Pop-Location
}
