$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot

Push-Location (Join-Path $repositoryRoot 'mobile')
try {
  flutter clean
  flutter pub get
  flutter build apk --debug
} finally {
  Pop-Location
}
