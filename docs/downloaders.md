# Media Downloaders (`tsukyio.downloaders`)

The **Downloaders Module** provides high-speed, multi-platform media extractors optimized for video editors and sound designers.

---

## 📥 Supported Platforms

| Platform | Methods | Capabilities |
|---|---|---|
| **YouTube** | `youtube(options)` | 4K 2160p, 1440p, 1080p, 60fps, 320kbps MP3 extraction |
| **Spotify** | `spotify(options)` | High-bitrate MP3, FLAC, WAV with ID3 metadata & album artwork |
| **SoundCloud** | `soundcloud(options)` | Lossless FLAC, WAV, and 320kbps MP3 audio |
| **TikTok** | `tiktok(options)` | HD video without watermark, isolated audio |
| **Instagram** | `instagram(options)` | Reels, Carousels, and Post videos |
| **Twitter / X** | `twitter(url)` | Highest quality MP4 video stream |
| **Twitch** | `twitch(url, quality?)` | VOD segments and clip downloads |
| **Pinterest** | `pinterest(url)` | High-resolution video and pin images |

---

## 🚀 Examples

### 1. YouTube 4K 60fps Video & 320kbps Audio

```typescript
// Download 1080p 60fps video
const videoTask = await tsukyio.downloaders.youtube({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  format: "mp4",
  quality: "1080p",
  fps60: true,
});

const video = await videoTask.waitForCompletion({
  onProgress: (s) => console.log(`Downloading: ${s.progress}%`),
});
console.log("Video URL:", video.downloadUrl);

// Download 320kbps MP3 audio only
const audioTask = await tsukyio.downloaders.youtube({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  format: "mp3",
  bitrate: "320",
});

const audio = await audioTask.waitForCompletion();
console.log("Audio URL:", audio.downloadUrl);
```

### 2. Spotify Track with Album Cover Metadata

```typescript
const task = await tsukyio.downloaders.spotify({
  url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  format: "mp3",
  bitrate: "320",
});

const track = await task.waitForCompletion();
console.log("Track:", track.title);
console.log("Artist:", track.author);
console.log("Download link:", track.downloadUrl);
```

### 3. TikTok HD (No Watermark)

```typescript
const task = await tsukyio.downloaders.tiktok({
  url: "https://www.tiktok.com/@user/video/1234567890",
  noWatermark: true,
});

const tiktok = await task.waitForCompletion();
console.log("Clean video URL:", tiktok.downloadUrl);
```

### 4. SoundCloud High-Bitrate Audio

```typescript
const task = await tsukyio.downloaders.soundcloud({
  url: "https://soundcloud.com/artist/track",
  format: "mp3",
  bitrate: "320",
});

const soundcloud = await task.waitForCompletion();
console.log("Audio URL:", soundcloud.downloadUrl);
```
