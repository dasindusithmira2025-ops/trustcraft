$ErrorActionPreference = 'Stop'

$sdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { 'C:\Android\Sdk' }
$adb = Join-Path $sdkRoot 'platform-tools\adb.exe'
$emulator = Join-Path $sdkRoot 'emulator\emulator.exe'
$avd = 'trustcraft_api36'

if (-not (Test-Path -LiteralPath $adb)) { throw "ADB was not found at $adb" }
if (-not (Test-Path -LiteralPath $emulator)) { throw "Android Emulator was not found at $emulator" }

& $adb start-server | Out-Null
$ready = (& $adb devices) -match '^emulator-\d+\s+device$'
if (-not $ready) {
  Write-Host "Starting TrustCraft emulator '$avd'..."
  Start-Process -FilePath $emulator -ArgumentList '-avd', $avd, '-gpu', 'software', '-netdelay', 'none', '-netspeed', 'full'
}

$deadline = (Get-Date).AddMinutes(5)
do {
  Start-Sleep -Seconds 3
  $deviceLine = & $adb devices | Select-String '^emulator-\d+\s+device$' | Select-Object -First 1
  $serial = if ($deviceLine) { $deviceLine.ToString().Split("`t")[0] } else { $null }
  if ($serial) {
    $bootAnimation = (& $adb -s $serial shell getprop init.svc.bootanim 2>$null).Trim()
    $activityService = (& $adb -s $serial shell service check activity 2>$null).Trim()
    if ($bootAnimation -eq 'stopped' -and $activityService -match 'found') {
      Write-Host "TrustCraft emulator is ready: $serial"
      exit 0
    }
  }
} while ((Get-Date) -lt $deadline)

throw 'The TrustCraft emulator did not complete boot within five minutes.'
