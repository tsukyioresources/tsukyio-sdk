# AI Tools & Processors (`tsukyio.tools`)

The **Tools Module** provides access to Tsukyio's server-side AI processing pipeline, including Demucs stem splitting, frame cleaners, scene cut detectors, and reverse image search.

---

## 🚀 Tool Task Handles & Polling

Heavy AI operations run asynchronously in background job workers. Calling a tool method returns a `ToolTaskHandle<T>` which provides real-time progress callbacks and task cancellation.

```typescript
const task = await tsukyio.tools.splitAudio({ ... });

// Poll until completed with live progress updates
const result = await task.waitForCompletion({
  intervalMs: 1500, // Check status every 1.5 seconds
  timeoutMs: 180000, // 3-minute timeout limit
  onProgress: (status) => {
    console.log(`Job status: ${status.status} (${status.progress}%)`);
  },
});
```

---

## 🛠 Available Tools

### 1. `splitAudio(options)`
Separate an audio track or song into stems using AI Demucs models.

```typescript
const task = await tsukyio.tools.splitAudio({
  audioUrl: "https://example.com/song.mp3",
  stems: 4, // 4-stem (vocals, drums, bass, other) or 2-stem (vocals, instrumental)
});

const result = await task.waitForCompletion({
  onProgress: (s) => console.log(`Progress: ${s.progress}%`),
});

console.log("Vocals stem URL:", result.vocalsUrl);
console.log("Drums stem URL:", result.drumsUrl);
console.log("Bass stem URL:", result.bassUrl);
console.log("Other stem URL:", result.otherUrl);
```

### 2. `cleanDeadframes(options)`
Scan video files to automatically detect and eliminate black frames, freeze frames, and duplicate rendering deadframes.

```typescript
const task = await tsukyio.tools.cleanDeadframes({
  videoUrl: "https://example.com/clip.mp4",
  threshold: 12, // Sensitivity threshold
});

const result = await task.waitForCompletion();
console.log("Cleaned video output:", result.outputUrl);
console.log("Dead frames removed:", result.cleanedFramesCount);
```

### 3. `splitScenes(options)`
Analyze video cuts and export individual scene segments.

```typescript
const task = await tsukyio.tools.splitScenes({
  videoUrl: "https://example.com/episode.mp4",
  threshold: 27,
});

const result = await task.waitForCompletion();
console.log(`Found ${result.totalScenes} individual scenes:`);
for (const clip of result.clips) {
  console.log(`- Scene: ${clip.name} (${clip.start}s - ${clip.end}s): ${clip.url}`);
}
```

### 4. `findAnime(imageUrl)`
Reverse search an anime screenshot to identify the show, episode number, exact timestamp, and similarity confidence.

```typescript
const matches = await tsukyio.tools.findAnime("https://example.com/screenshot.jpg");

for (const match of matches) {
  console.log(`Anime: ${match.anime}`);
  console.log(`Episode: ${match.episode}`);
  console.log(`Timestamp: ${match.timestamp}`);
  console.log(`Similarity: ${(match.similarity * 100).toFixed(1)}%`);
}
```

### 5. `findSong(audioUrl)`
Identify song title, artist, album, and Spotify/YouTube links from an audio clip.

```typescript
const song = await tsukyio.tools.findSong("https://example.com/audio-snippet.mp3");

console.log(`Title: ${song.title}`);
console.log(`Artist: ${song.artist}`);
console.log(`Spotify Link: ${song.spotifyUrl}`);
```
