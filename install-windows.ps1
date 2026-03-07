# ClawController Windows Installer
# Downloads and installs ClawController for Windows

$VERSION = "0.1.0"
$APP_NAME = "ClawController"
$MSI_NAME = "${APP_NAME}_${VERSION}_x64-setup.msi"
$DOWNLOAD_URL = "https://github.com/OpenKrab/ClawStart/releases/download/claw-controller-v${VERSION}/${MSI_NAME}"
$TEMP_DIR = "$env:TEMP\ClawController-${VERSION}"

Write-Host "Installing ClawController v${VERSION} for Windows..." -ForegroundColor Cyan

# Create temp directory
New-Item -ItemType Directory -Force -Path $TEMP_DIR | Out-Null

# Download
Write-Host "Downloading ${MSI_NAME}..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $DOWNLOAD_URL -OutFile "${TEMP_DIR}\${MSI_NAME}"

# Install MSI silently
Write-Host "Installing..." -ForegroundColor Yellow
msiexec /i "${TEMP_DIR}\${MSI_NAME}" /quiet /qn /norestart

# Cleanup
Remove-Item -Recurse -Force $TEMP_DIR

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Find ClawController in your Start Menu."
