# Opens the generated deck in the real PowerPoint and exports one PNG per slide.
# This is the validation step that matters: the previews are what PowerPoint
# itself draws, not an approximation from another renderer.
#
#   powershell -ExecutionPolicy Bypass -File preview.ps1 [-Deck <path>] [-Out <dir>]

param(
  [string]$Deck = "$PSScriptRoot\..\output\TrustCraft_DHACK_Grand_Final.pptx",
  [string]$Out  = "$PSScriptRoot\..\previews",
  [int]$Width   = 1920
)

$ErrorActionPreference = 'Stop'
$Deck = (Resolve-Path $Deck).Path
New-Item -ItemType Directory -Force -Path $Out | Out-Null
Get-ChildItem -Path $Out -Filter 'slide-*.png' -ErrorAction SilentlyContinue | Remove-Item -Force

$ppt = New-Object -ComObject PowerPoint.Application
try {
  $pres = $ppt.Presentations.Open($Deck, $true, $false, $false)   # read-only, no window
  Write-Host "slides: $($pres.Slides.Count)"

  foreach ($slide in $pres.Slides) {
    $n = '{0:d2}' -f $slide.SlideIndex
    $slide.Export("$Out\slide-$n.png", 'PNG', $Width, [int]($Width * 9 / 16))
  }

  # A PDF alongside the PNGs: a hand-off artefact and a second integrity check.
  $pres.SaveCopyAs("$Out\..\output\TrustCraft_DHACK_Grand_Final.pdf", 32)

  $pres.Close()
  Write-Host "exported to $Out"
}
finally {
  $ppt.Quit()
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt)
}
