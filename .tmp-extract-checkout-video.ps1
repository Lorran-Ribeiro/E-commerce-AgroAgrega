param(
  [Parameter(Mandatory = $true)]
  [string]$VideoPath,
  [Parameter(Mandatory = $true)]
  [string]$OutputDirectory
)

Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

if (-not (Test-Path -LiteralPath $OutputDirectory)) {
  New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

$player = [System.Windows.Media.MediaPlayer]::new()
$player.Volume = 0
$player.ScrubbingEnabled = $true
$player.Open([Uri]::new($VideoPath))
$player.Play()

$deadline = [DateTime]::UtcNow.AddSeconds(8)
while (($player.NaturalVideoWidth -le 0 -or $player.NaturalVideoHeight -le 0) -and [DateTime]::UtcNow -lt $deadline) {
  Start-Sleep -Milliseconds 100
}

if ($player.NaturalVideoWidth -le 0 -or $player.NaturalVideoHeight -le 0) {
  $player.Close()
  throw 'Não foi possível carregar os quadros do vídeo.'
}

$positions = @(2.0, 7.0, 12.0, 17.0, 22.0)
$width = $player.NaturalVideoWidth
$height = $player.NaturalVideoHeight

for ($index = 0; $index -lt $positions.Count; $index++) {
  $player.Position = [TimeSpan]::FromSeconds($positions[$index])
  $player.Play()
  Start-Sleep -Milliseconds 500
  $player.Pause()

  $visual = [System.Windows.Media.DrawingVisual]::new()
  $context = $visual.RenderOpen()
  $context.DrawVideo($player, [System.Windows.Rect]::new(0, 0, $width, $height))
  $context.Close()

  $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new(
    $width,
    $height,
    96,
    96,
    [System.Windows.Media.PixelFormats]::Pbgra32
  )
  $bitmap.Render($visual)

  $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
  $framePath = Join-Path $OutputDirectory ("frame-{0:D2}.png" -f ($index + 1))
  $stream = [System.IO.File]::Open($framePath, [System.IO.FileMode]::Create)
  try {
    $encoder.Save($stream)
  } finally {
    $stream.Dispose()
  }
}

$player.Close()
Write-Output ("frames=5 size={0}x{1}" -f $width, $height)
