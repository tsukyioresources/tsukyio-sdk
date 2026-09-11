<h1 align="center">
  <img src="https://tsukyio.com/LogoTsukyio.png" width="80" alt="Tsukyio Icon"/>
  <br />
  Tsukyio SDK
</h1>
<p align="center">
  <b>The Official TypeScript & JavaScript SDK for the Tsukyio Creator Ecosystem.</b><br>
  <i>Universal, zero-dependency client for the Vault, Anime Raw Clips, AI Splitters, Media Downloaders, AEP Downgraders, and Project Archives.</i>
</p>

<p align="center">
  <a href="#-about">🎬 About</a> •
  <a href="#-key-features">⚡ Features</a> •
  <a href="#-installation">📦 Installation</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-api-modules">📚 API Modules</a> •
  <a href="#-device-oauth-flow">🔑 OAuth Flow</a> •
  <a href="#-project-structure">📂 Structure</a> •
  <a href="#-official-links">🌐 Community</a>
</p>

<hr>

## 🎬 About

**`tsukyio-sdk`** is the official, high-performance client library designed for developers, After Effects extension creators, Desktop app builders, and automation bots integrating with **[Tsukyio](https://tsukyio.com)**.

> [!NOTE]
> **Canonical Web Domain:** [`https://tsukyio.com`](https://tsukyio.com)  
> **Universal Dual Exports:** ESM (`.mjs`), CommonJS (`.cjs`), and TypeScript Declarations (`.d.ts`).  
> **Zero Runtime Dependencies:** Built strictly on native web standard `fetch` with automated retry, backoff, and task polling.

---

## ⚡ Key Features

| Module | Capability & Description |
| :--- | :--- |
| **💎 Creator Vault** | Search and download 40,000+ curated editing assets, flow clips, overlays, presets, SFX, and 3D models. |
| **🎬 Raw Anime Cuts** | Stream, inspect, and retrieve lossless 1080p/4K ProRes anime scene cuts and episodes. |
| **🤖 AI Splitters & Tools** | Demucs 4-Stem AI Audio Separator, AMVerge Deadframe cleaner, Scene cut finder, Anime scene identifier, and Shazam song finder. |
| **📥 Media Downloaders** | High-fidelity extractors for YouTube (4K 60fps), Spotify (320kbps MP3), SoundCloud, TikTok (No Watermark), Instagram, Twitter/X, Twitch, and Pinterest. |
| **🗜️ AEP & FFX Downgraders** | Downgrade Adobe After Effects projects (`.aep`) and presets (`.ffx`) down to CS6, plus full project font and plugin inspection. |
| **🔄 Media Converters** | Convert and transcode audio, video, and images to modern web and VFX containers with customized bitrates and resolutions. |
| **📂 Projects & Edits** | Access community After Effects, Premiere Pro, and DaVinci project templates and curated cinematic AMVs. |
| **🔑 RFC 8628 OAuth** | Native Device Authorization flow for desktop applications, CLI utilities, and After Effects (CEP/UXP) plugins. |

---

## 📦 Installation

Install the package via your preferred package manager:

```bash
npm install tsukyio-sdk
# or
pnpm add tsukyio-sdk
# or
yarn add tsukyio-sdk
# or
bun add tsukyio-sdk
```

---

## 🚀 Quick Start

### 1. Initialize the Client

```typescript
import { createTsukyioClient } from "tsukyio-sdk";

const tsukyio = createTsukyioClient({
  apiKey: process.env.TSUKYIO_API_KEY, // Or pass your Bearer access token
  baseUrl: "https://tsukyio.com",      // Defaults to https://tsukyio.com
});
```

### 2. Search & Download from Creator Vault

```typescript
// Fast search across 40k+ assets
const assets = await tsukyio.vault.search("impact overlay", "overlays");
console.log(`Found ${assets.length} assets:`, assets);

// Generate signed 24-hour download token
const downloadToken = await tsukyio.vault.getDownloadToken(assets[0].id);
console.log("Direct Download URL:", downloadToken.url);
```

### 3. AI Audio Stem Separation with Live Progress

```typescript
// Dispatch AI Demucs 4-stem separation task
const task = await tsukyio.tools.splitAudio({
  audioUrl: "https://example.com/audio.mp3",
  stems: 4,
});

// Stream real-time progress until finished
const stems = await task.waitForCompletion({
  intervalMs: 1500,
  onProgress: (status) => console.log(`Separating: ${status.progress}%`),
});

console.log("Vocals:", stems.vocalsUrl);
console.log("Drums:", stems.drumsUrl);
console.log("Bass:", stems.bassUrl);
console.log("Other:", stems.otherUrl);
```

### 4. Download 4K 60fps YouTube Media

```typescript
const ytTask = await tsukyio.downloaders.youtube({
  url: "https://www.youtube.com/watch?v=sample",
  quality: "1080p",
  fps60: true,
});

const media = await ytTask.waitForCompletion();
console.log("Download link:", media.downloadUrl);
```

---

## 📚 API Modules

### `tsukyio.vault`
- `list(options)` - List files and directories in vault categories.
- `search(query, category?)` - Search assets by keyword.
- `deepSearch(query, category?)` - Recursive archive search.
- `getAsset(id)` - Fetch detailed asset metadata.
- `getDownloadToken(id, expiresInSeconds?)` - Generate signed high-speed download link.
- `getCategories()` - List all official Vault categories.

### `tsukyio.rawClips`
- `listCollections(options)` - Browse raw anime cuts and episode structures.
- `getStreamUrl(filePath)` - Get Range-proxy streaming URL for zero-lag in-browser scrubbing.

### `tsukyio.tools`
- `splitAudio({ audioUrl, stems })` - AI Demucs audio separation.
- `cleanDeadframes({ videoUrl, threshold })` - Remove black and duplicate freeze frames.
- `splitScenes({ videoUrl, threshold })` - Detect and split video scene cuts.
- `findAnime(imageUrl)` - Reverse image anime search (trace.moe).
- `findSong(audioUrl)` - Shazam song identifier.

### `tsukyio.downloaders`
- `youtube(options)` - Download YouTube videos or high-bitrate MP3 audio.
- `spotify(options)` - Download Spotify tracks with ID3 tags and album cover art.
- `soundcloud(options)` - Download 320kbps SoundCloud audio.
- `tiktok(options)` - Download watermark-free TikTok videos.
- `instagram(options)` - Download Instagram Reels and posts.
- `twitter(url)` / `twitch(url)` / `pinterest(url)` - Extract media across creator networks.

### `tsukyio.afterEffects`
- `downgradeAep({ fileUrl, targetVersion })` - Downgrade `.aep` projects down to CS6.
- `downgradeFfx({ fileUrl, targetVersion })` - Downgrade `.ffx` presets down to CS6.
- `inspectAep(fileUrl)` - Diagnose missing fonts, plugins, and dependencies.

### `tsukyio.converters`
- `convertAudio(options)` - Transcode audio (MP3, WAV, FLAC, AAC, OGG).
- `convertVideo(options)` - Transcode video (MP4, WebM, MOV, MKV, GIF).
- `convertImage(options)` - Optimize images (PNG, WebP, AVIF, JPG).

### `tsukyio.projects` & `tsukyio.edits` & `tsukyio.drops`
- `projects.list(options)` - Community project templates.
- `projects.getDownloadUrl(id)` - Download template assets.
- `edits.list(options)` / `edits.getRandom(limit)` - Curated AMV showcase.
- `drops.list(options)` / `drops.getLatest()` - Vault drop announcements.

---

## 🔑 Device OAuth Flow

For desktop apps and After Effects extensions, authenticate users without embedding login forms using the RFC 8628 Device Code flow:

```typescript
// 1. Request user & device code
const device = await tsukyio.oauth.requestDeviceCode("YOUR_CLIENT_ID");
console.log(`Open ${device.verification_uri_complete} to authorize`);

// 2. Poll for the access token while the user authorizes in browser
const token = await tsukyio.oauth.pollDeviceToken({
  clientId: "YOUR_CLIENT_ID",
  deviceCode: device.device_code,
  onWaiting: () => console.log("Waiting for user authorization..."),
});

// 3. Attach token to client
tsukyio.setAccessToken(token.access_token);
```

---

## 📂 Project Structure

```
packages/tsukyio-sdk/
├── src/
│   ├── modules/                  # Specialized domain API modules
│   │   ├── after-effects.ts      # AEP/FFX Downgraders & Inspector
│   │   ├── converters.ts         # Audio/Video/Image Transcoders
│   │   ├── downloaders.ts        # Multi-Platform Media Extractors
│   │   ├── drops.ts              # Community Vault Drops
│   │   ├── edits.ts              # Curated AMV Showcase
│   │   ├── oauth.ts              # RFC 8628 Device Flow
│   │   ├── projects.ts           # Community Project Files
│   │   ├── raw-clips.ts          # Anime Raw Cuts & Streaming
│   │   ├── search.ts             # Multi-Domain Global Search
│   │   ├── stats.ts              # Platform Asset Metrics
│   │   ├── tools.ts              # AI Splitters & Frame Cleaners
│   │   └── vault.ts              # Creator Vault File Explorer
│   ├── types/                    # Strict TypeScript Interfaces
│   ├── client.ts                 # TsukyioClient Class Aggregator
│   ├── errors.ts                 # Typed Error Classes
│   ├── http.ts                   # Universal Fetch Client
│   └── index.ts                  # SDK Entrypoint & Exports
├── scripts/                      # Live Integration Testing Scripts
├── tests/                        # Vitest Unit Test Suite
├── package.json                  # Package Configuration & Dual Exports
├── tsconfig.json                 # Strict TypeScript Configuration
└── tsup.config.ts                # Dual ESM / CJS Build Bundler
```

---

## 🌐 Official Links

- **Website:** [https://tsukyio.com](https://tsukyio.com)
- **Discord Server:** [https://discord.gg/WnYX7QvNyy](https://discord.gg/WnYX7QvNyy)
- **Patreon:** [https://www.patreon.com/cw/tsukyio/membership](https://www.patreon.com/cw/tsukyio/membership)
- **YouTube:** [https://youtube.com/@tsukyioresources](https://youtube.com/@tsukyioresources)
- **TikTok:** [https://tiktok.com/@tsukyioxyz](https://tiktok.com/@tsukyioxyz)
- **Twitter / X:** [https://twitter.com/tsukyioxyz](https://twitter.com/tsukyioxyz)
