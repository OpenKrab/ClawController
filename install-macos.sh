#!/bin/bash

# ClawController macOS Installer
# Downloads and installs ClawController with all required dependencies

set -e

VERSION="0.1.0"
APP_NAME="ClawController"
TEMP_DIR="/tmp/ClawController-${VERSION}"

echo "Installing ClawController v${VERSION} for macOS..."

# Detect Apple Silicon or Intel
if [[ $(uname -m) == "arm64" ]]; then
    ARCH="aarch64"
    ARCH_NAME="Apple Silicon"
else
    ARCH="x64"
    ARCH_NAME="Intel"
fi

echo "Detected architecture: ${ARCH_NAME}"

# Download URL (adjust pattern as needed for your releases)
APP_TAR_NAME="${APP_NAME}_${VERSION}_${ARCH}.app.tar.gz"
DOWNLOAD_URL="https://github.com/OpenKrab/ClawStart/releases/download/claw-controller-v${VERSION}/${APP_TAR_NAME}"

echo "Downloading ${APP_TAR_NAME}..."
mkdir -p "${TEMP_DIR}"
cd "${TEMP_DIR}"
curl -L -o "${APP_TAR_NAME}" "${DOWNLOAD_URL}"

# Extract
echo "Extracting..."
tar -xzf "${APP_TAR_NAME}"

# Move to Applications
echo "Installing to /Applications..."
sudo mv "${APP_NAME}.app" /Applications/

# Cleanup
cd /
rm -rf "${TEMP_DIR}"

echo "Installation complete!"
echo "Open ClawController from: /Applications/${APP_NAME}.app"
