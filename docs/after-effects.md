# Adobe After Effects Suite (`tsukyio.afterEffects`)

The **After Effects Module** provides utilities for Adobe After Effects editors and plugin developers, including automated version downgrading and project dependency inspection.

---

## 🗜️ Version Downgrading

Easily convert newer Adobe After Effects project files (`.aep`) and presets (`.ffx`) to be opened seamlessly in older versions down to CS6.

### Supported Target Versions:
- `"2024"`, `"2023"`, `"2022"`, `"2021"`, `"2020"`
- `"CC17"`, `"CC16"`, `"CC15"`, `"CC14"`
- `"CS6"`

---

## 🔍 Methods

### 1. `downgradeAep(options)`
Downgrade an After Effects project file (`.aep`) to a legacy version.

```typescript
const task = await tsukyio.afterEffects.downgradeAep({
  fileUrl: "https://example.com/project-2024.aep",
  targetVersion: "2020",
});

const result = await task.waitForCompletion();
console.log("Downgraded project URL:", result.outputUrl);
console.log("Downgraded to version:", result.downgradedTo);
console.log("File size:", result.fileSize);
```

### 2. `downgradeFfx(options)`
Downgrade an After Effects effect preset file (`.ffx`).

```typescript
const task = await tsukyio.afterEffects.downgradeFfx({
  fileUrl: "https://example.com/preset.ffx",
  targetVersion: "CC15",
});

const result = await task.waitForCompletion();
console.log("Downgraded preset URL:", result.outputUrl);
```

### 3. `inspectAep(fileUrl)`
Inspect a `.aep` project file to diagnose missing fonts, third-party plugins, broken footage paths, and expression errors without opening After Effects.

```typescript
const report = await tsukyio.afterEffects.inspectAep("https://example.com/project.aep");

console.log("Project Name:", report.projectName);
console.log("Created In Version:", report.createdVersion);
console.log("Compositions:", report.compositionsCount);
console.log("Fonts Required:", report.fontsUsed);
console.log("Plugins Required:", report.pluginsUsed);
console.log("Missing Footage:", report.missingFootage);
```
