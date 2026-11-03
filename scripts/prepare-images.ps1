# Sources/credits are in data/photo-credits.json; original downloads stay ignored.
Add-Type -AssemblyName System.Drawing
$workspaceRoot = (Get-Location).Path
$credits = Get-Content data/photo-credits.json -Raw | ConvertFrom-Json
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$manifest = @{}
foreach ($photo in $credits) {
  $source = [System.Drawing.Image]::FromFile((Join-Path $workspaceRoot ('qa-artifacts/' + $photo.key + '-source.jpg')))
  $large = [Math]::Min(1280, $source.Width)
  if ($photo.key -eq 'gurez-landscape') { $large = [Math]::Min(1920, $source.Width) }
  $variants = @()
  foreach ($width in @([Math]::Min(640, $large), $large) | Select-Object -Unique) {
    $height = [int][Math]::Round($source.Height * $width / $source.Width)
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = 'HighQualityBicubic'
    $graphics.DrawImage($source, 0, 0, $width, $height)
    $filename = 'assets/' + $photo.key + '-' + $width + '.jpg'
    $quality = 78
    do {
      $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
      $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
      $bitmap.Save((Join-Path $workspaceRoot $filename), $encoder, $parameters)
      $parameters.Dispose()
      $quality -= 6
    } while ((Get-Item -LiteralPath $filename).Length -gt 290000 -and $quality -ge 42)
    $variants += @{ width=$width; height=$height; src=$filename }
    $graphics.Dispose()
    $bitmap.Dispose()
  }
  $manifest[$photo.key] = @{ width=$large; height=[int][Math]::Round($source.Height * $large / $source.Width); variants=$variants }
  $source.Dispose()
}
$manifest | ConvertTo-Json -Depth 6 | Set-Content data/photo-dimensions.json
