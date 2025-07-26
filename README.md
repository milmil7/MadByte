# 🚀 MadByte Download Manager

**MadByte** is a modern, fast, and beautifully themed download manager built with **Tauri**, **React**, and **Rust**. It gives you full control over your downloads with an intuitive UI, multiple themes, queueing, retry logic, and much more—all wrapped in a sleek, customizable interface.


## ✨ Features

- 🔁 **Queue-based Download Management**  
  Organize and prioritize downloads with full control over order and concurrency.

- 💾 **Pause / Resume / Dequeue**  
  Control any download on demand. Supports resuming interrupted downloads.

- 🎛️ **Speed Limiting**  
  Set global speed caps to save bandwidth.

- ⚙️ **Custom Retry Logic**  
  Set retry attempts and delay durations for automatic error recovery.

- 📁 **Download Path Selection**  
  Choose where your files land. Set and forget.

- 🌐 **File Conflict Resolution**  
  MadByte prompts when a file already exists. You can:
  - Resume
  - Overwrite
  - Rename

- 🌈 **Multiple UI Themes**  
  Choose your favorite look from:
  - Brutalist
  - Glass
  - Morph
  - Anime
  - Material

- 🔍 **Search & Filter Downloads**  
  Easily find what you've downloaded.

- 📦 **Auto Start on System Boot** *(Optional)*  
  Enable/disable autostart functionality right from settings.

- 🖥️ **System Tray Support**  
  App minimizes to tray instead of closing (optional config).

---

## 🚀 Getting Started

### 🧰 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### 🔧 Setup

```bash
git clone https://github.com/yourusername/madbyte.git
cd madbyte

# Install frontend dependencies
npm install

# Start the Tauri app
npm run tauri dev
```

### 🛠️ Build

To build a production-ready executable:

```bash
npm run tauri build --release
```

Output will be in the `src-tauri/target/release/bundle` folder.

---

## 💡 Tech Stack

- ⚙️ Tauri — Lightweight native shell for desktop apps
- ⚛️ React — UI layer
- 🦀 Rust — Superfast backend with native bindings
- 🎨 Custom Theme Engine — Easily swappable themes using JSON style config

---

## 📸 Screenshots

Coming soon...  
You can contribute by submitting screenshots or GIFs!

---

## 🙌 Contribution

We welcome PRs and feedback!  

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📬 Contact

Created by @milmil7  
Reach me via GitHub issues or pull requests!

**MadByte — Your downloads, your way. 🚀**