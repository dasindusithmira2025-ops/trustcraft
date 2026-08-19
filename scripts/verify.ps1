$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot

Push-Location $repositoryRoot
try {
  pnpm install --frozen-lockfile
  pnpm build
} finally {
  Pop-Location
}

Push-Location (Join-Path $repositoryRoot 'mobile')
try {
  flutter doctor -v
  flutter pub get
  dart format --output=none --set-exit-if-changed lib test integration_test
  flutter analyze
  flutter test
  flutter build apk --debug
} finally {
  Pop-Location
}
