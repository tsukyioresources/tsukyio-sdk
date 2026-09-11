# Creator Vault API (`tsukyio.vault`)

The **Vault Module** provides programmatic access to Tsukyio's library of 40,000+ curated anime editing assets, including flow clips, precuts, overlays, presets, audio vocals, SFX, remake clips, green screens, and 3D models.

---

## 📂 Vault Categories

Tsukyio Vault assets are organized into standardized categories:
- `precuts` - Anime action & character cut sequences.
- `raw` - Lossless raw anime episodes & clips.
- `flow` - Flow edit clips & transitions.
- `presets` - After Effects (`.ffx`), Premiere (`.prfpset`), and DaVinci (`.setting`) presets.
- `vocals` - Isolated anime voice lines & acapellas.
- `overlays` - Particles, dust, light leaks, film burns, impact textures.
- `sfx` - Sound effects, whooshes, impacts, cinematic risers.
- `remake_clips` - Project assets for AMV remakes.
- `green_screen` - Chroma-key anime VFX & characters.
- `3d_models` - Blender and OBJ 3D anime models.

---

## 🔍 Methods

### 1. `list(options)`
Browse files and subdirectories with optional category and path filters.

```typescript
const vaultContents = await tsukyio.vault.list({
  category: "overlays",
  path: "Overlays/Impacts",
  limit: 20,
  page: 1,
});

console.log(`Found ${vaultContents.items.length} items.`);
console.log("Current path:", vaultContents.currentPath);
```

### 2. `search(query, category?)`
Fast keyword search across all indexed vault assets.

```typescript
const results = await tsukyio.vault.search("fire transition", "overlays");

for (const asset of results) {
  console.log(`- ${asset.name} (${asset.size} bytes)`);
}
```

### 3. `deepSearch(query, category?)`
Recursive deep search scanning through subfolders and nested project archives.

```typescript
const deepResults = await tsukyio.vault.deepSearch("jujutsu kaisen", "raw");
```

### 4. `getAsset(assetId)`
Fetch detailed metadata, tags, dimensions, duration, and author info for a specific asset.

```typescript
const asset = await tsukyio.vault.getAsset("cmobtp2bs008qw4ri50zjb2jp");
console.log("Asset title:", asset.name);
console.log("MIME Type:", asset.type);
```

### 5. `getDownloadToken(assetId, expiresInSeconds?)`
Generate a cryptographically signed, high-speed download token.

```typescript
// Default token valid for 24 hours (86,400 seconds)
const token = await tsukyio.vault.getDownloadToken("cmobtp2bs008qw4ri50zjb2jp", 86400);

console.log("Download URL:", token.url);
console.log("Token expires at:", token.expiresAt);
```
