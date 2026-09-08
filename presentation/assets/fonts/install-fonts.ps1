# Installs the Inter faces the TrustCraft deck uses, for the CURRENT USER only.
# No admin rights needed, nothing system-wide is touched.
# Inter is SIL Open Font Licence 1.1 (see OFL.txt) — free to install and redistribute.
#
#   powershell -ExecutionPolicy Bypass -File install-fonts.ps1
#
# To undo: delete the matching Inter-*.ttf files from
#   $env:LOCALAPPDATA\Microsoft\Windows\Fonts
# and remove their entries from HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts

$ErrorActionPreference = 'Stop'
$src  = $PSScriptRoot
$dest = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Fonts'
$key  = 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts'

New-Item -ItemType Directory -Force -Path $dest | Out-Null
if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }

$faces = @{
  'Inter-Regular.ttf'   = 'Inter (TrueType)'
  'Inter-Medium.ttf'    = 'Inter Medium (TrueType)'
  'Inter-SemiBold.ttf'  = 'Inter SemiBold (TrueType)'
  'Inter-Bold.ttf'      = 'Inter Bold (TrueType)'
  'Inter-ExtraBold.ttf' = 'Inter ExtraBold (TrueType)'
}

foreach ($file in $faces.Keys) {
  $from = Join-Path $src $file
  if (-not (Test-Path $from)) { Write-Warning "missing $file"; continue }
  Copy-Item $from (Join-Path $dest $file) -Force
  New-ItemProperty -Path $key -Name $faces[$file] -Value (Join-Path $dest $file) -PropertyType String -Force | Out-Null
  Write-Host "installed $file"
}

Write-Host "`nDone. Restart PowerPoint if it is already open."
