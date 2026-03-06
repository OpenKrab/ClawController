<div align="center">
  <h1>ClawController 🦞</h1>
  <p><strong>A Sleek, Lightweight Desktop Gateway Manager for OpenClaw.</strong></p>
</div>

---

**ClawController** is a dedicated administration app designed to orchestrate your OpenClaw Gateway instances without having to dig through command lines. Designed for desktop, it serves as a lightweight system tray / widget companion built on native webviews using Tauri v2.

## ✨ Features

- **Start/Stop UI:** Instant status visualizer to manage Node states.
- **Smart Fix / Hard Reset ⚡:** Easily eradicate hanging or zombified node instances safely.
- **Live Logs 📄:** Stream the raw event logs of your OpenClaw node seamlessly into an independent terminal window.
- **Doctor 🩺:** Run built-in diagnostic tools to check OpenClaw’s health.
- **Cross-Platform:** Available and natively optimized for **Windows**, **macOS**, and **Linux**.

---

## � Project Structure

![Project Structure](./assets/project-structure.png)
*Visual breakdown of the repository, containing GitHub Actions, media assets, the main source code, and the pre-built executable.*

---

## �🚀 Quick Download

Head over to the [Releases tab](https://github.com/OpenKrab/ClawStart/releases) to download the latest precompiled `ClawController.exe` for Windows, `.dmg` for Mac, or `.AppImage` for Linux.

*Note: GitHub Actions automatically build the binary releases directly from source code on every new tag!*

### 💻 Terminal Installation (Quick Start)

**Windows (PowerShell):**

```powershell
$v="0.1.0"; $url="https://github.com/OpenKrab/ClawController/releases/download/v$v/ClawController_$($v)_x64-setup.exe"; $out="$HOME\Downloads\ClawController-Setup.exe"; Invoke-WebRequest -Uri $url -OutFile $out; Start-Process $out
```

**macOS (Terminal):**

```bash
v="0.1.0" && curl -L -o ~/Downloads/ClawController.dmg "https://github.com/OpenKrab/ClawController/releases/download/v$v/ClawController_${v}_universal.dmg" && open ~/Downloads/ClawController.dmg
```

**Linux (Terminal):**

```bash
v="0.1.0" && curl -L -o ~/ClawController.AppImage "https://github.com/OpenKrab/ClawController/releases/download/v$v/ClawController_${v}_amd64.AppImage" && chmod +x ~/ClawController.AppImage && ./~/ClawController.AppImage
```

## 🛠️ For Developers

If you want to tweak styles, add features or build from the source code locally yourself:

1. **Prerequisites**: Ensure you have [Rust](https://rustup.rs/), [Node.js (v20+)](https://nodejs.org/), and [pnpm](https://pnpm.io/) fully installed on your machine.
2. **Clone & Install**:

```bash
git clone https://github.com/OpenKrab/ClawStart.git
cd ClawStart/claw-controller
pnpm install
```

1. **Run in Dev Mode**:

```bash
pnpm tauri dev
```

1. **Compile for your current OS**:

```bash
pnpm tauri build
```

---

<div align="center">
  <img src="./assets/claw-controller-screenshot.png" width="600" alt="ClawController Preview" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
  <p><strong>Application Preview:</strong> <em>ClawController running on Windows with an active gateway status.</em></p>
  <p>Built with 🦞 by the OpenClaw Community • Tauri • React + Vite</p>
</div>
