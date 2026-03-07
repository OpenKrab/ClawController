$VERSION = "0.1.0"
$APP_NAME = "ClawController"
$EXE_NAME = "${APP_NAME}_${VERSION}_x64-setup.exe"
$DOWNLOAD_URL = "https://github.com/OpenKrab/ClawStart/releases/download/claw-controller-v${VERSION}/${EXE_NAME}"
$TEMP_DIR = "$env:TEMP\ClawController-${VERSION}"

Write-Host "Installing ClawController v${VERSION} for Windows..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $TEMP_DIR | Out-Null

Write-Host "Downloading ${EXE_NAME}..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $DOWNLOAD_URL -OutFile "${TEMP_DIR}\${EXE_NAME}"

Write-Host "Installing..." -ForegroundColor Yellow
Start-Process -FilePath "${TEMP_DIR}\${EXE_NAME}" -Wait

Remove-Item -Recurse -Force $TEMP_DIR

Write-Host "Installation complete!" -ForegroundColor Green
