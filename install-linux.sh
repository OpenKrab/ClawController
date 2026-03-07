#!/bin/bash

# ClawController Linux Installer
# Downloads and installs ClawController AppImage with all required dependencies

set -e

VERSION="0.1.0"
APP_NAME="ClawController"
APPIMAGE_NAME="${APP_NAME}_${VERSION}_amd64.AppImage"
DOWNLOAD_URL="https://github.com/OpenKrab/ClawStart/releases/download/claw-controller-v${VERSION}/${APPIMAGE_NAME}"
INSTALL_DIR="$HOME"
APPIMAGE_PATH="${INSTALL_DIR}/${APP_NAME}.AppImage"

echo "🦞 Installing ClawController v${VERSION} for Linux..."

# Update package lists
echo "📦 Updating package lists..."
sudo apt-get update

# Install required dependencies (Electron/Tauri AppImage)
echo "🔧 Installing dependencies..."
sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    libappindicator3-dev \
    librsvg2-dev \
    patchelf \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libdbus-1-3 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcairo-gobject2 \
    libcups2 \
    libexpat1 \
    libfontconfig1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxext6 \
    libxfixes3 \
    libxrender1 \
    libxss1 \
    ca-certificates \
    libdrm2 \
    libgbm1

# Download AppImage
echo "⬇️  Downloading ClawController..."
curl -L -o "${APPIMAGE_PATH}" "${DOWNLOAD_URL}"

# Make executable
echo "🔑 Making executable..."
chmod +x "${APPIMAGE_PATH}"

# Verify download
if [ -f "${APPIMAGE_PATH}" ] && [ -s "${APPIMAGE_PATH}" ]; then
    echo "✅ Download completed successfully!"
    echo "📁 File location: ${APPIMAGE_PATH}"
    echo "🚀 Run with: ${APPIMAGE_PATH}"
    
    # Optional: Create desktop shortcut
    if command -v desktop-file-install &> /dev/null; then
        echo "🖥️  Creating desktop shortcut..."
        cat > "${HOME}/Desktop/ClawController.desktop" << EOF
[Desktop Entry]
Name=ClawController
Comment=A Sleek, Lightweight Desktop Gateway Manager for OpenClaw
Exec=${APPIMAGE_PATH}
Icon=${APPIMAGE_PATH}
Terminal=false
Type=Application
Categories=Utility;
EOF
        chmod +x "${HOME}/Desktop/ClawController.desktop"
        echo "✅ Desktop shortcut created!"
    fi
    
    echo ""
    echo "🎉 Installation complete!"
    echo "📋 Quick start:"
    echo "   Run: ${APPIMAGE_PATH}"
    echo "   Or double-click the desktop shortcut"
    
else
    echo "❌ Download failed! Please check your internet connection."
    exit 1
fi
