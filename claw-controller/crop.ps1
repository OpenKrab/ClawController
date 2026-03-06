Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("public\logo-claw.png")
$bmp = New-Object System.Drawing.Bitmap 1280, 1280
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($img, 0, (1280-853)/2, 1280, 853)
$bmp.Save("public\logo-claw-sq.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
