<div align="center">
  <img src="./claw-controller/public/logo-claw-sq.png" width="150" alt="ClawController Logo" />
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

## 🚀 Quick Download

Head over to the [Releases tab](https://github.com/OpenKrab/ClawStart/releases) to download the latest precompiled `ClawController.exe` for Windows, `.dmg` for Mac, or `.AppImage` for Linux.

*Note: GitHub Actions automatically build the binary releases directly from source code on every new tag!*

## 🛠️ For Developers

If you want to tweak styles, add features or build from the source code locally yourself:

1. **Prerequisites**: Ensure you have [Rust](https://rustup.rs/), [Node.js (v20+)](https://nodejs.org/), and [pnpm](https://pnpm.io/) fully installed on your machine.
2. **Clone & Install**:
```bash
git clone https://github.com/OpenKrab/ClawStart.git
cd ClawStart/claw-controller
pnpm install
```
3. **Run in Dev Mode**:
```bash
pnpm tauri dev
```
4. **Compile for your current OS**:
```bash
pnpm tauri build
```

---

<p align="center">Built with 🦞 by the OpenClaw Community • Tauri • React + Vite</p>