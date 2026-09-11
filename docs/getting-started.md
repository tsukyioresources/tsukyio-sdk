# Getting Started with Tsukyio SDK

Welcome to the official developer guide for **`tsukyio-sdk`**. This package provides a unified, zero-dependency interface to interact with the Tsukyio creator ecosystem.

---

## 📦 Installation

Install `tsukyio-sdk` using your preferred package manager:

```bash
# npm
npm install tsukyio-sdk

# pnpm
pnpm add tsukyio-sdk

# yarn
yarn add tsukyio-sdk

# bun
bun add tsukyio-sdk
```

---

## 🔑 Authentication

Most read-only endpoints (e.g. public search, showcase edits) work without authentication. Accessing the Creator Vault, AI Tools, Downgraders, and Media Downloaders requires either:

1. **API Key**: Issued from your Tsukyio Creator Profile settings (format: `tsk_...`).
2. **OAuth 2.0 Access Token**: Obtained via Device Authorization Grant or Web OAuth flow.

```typescript
import { createTsukyioClient } from "tsukyio-sdk";

// Initialize with an API Key
const tsukyio = createTsukyioClient({
  apiKey: process.env.TSUKYIO_API_KEY,
});
```

---

## ⚙️ Configuration Options

The `createTsukyioClient` factory accepts the following client configuration:

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | `undefined` | Your Tsukyio API Key (`tsk_...`) or OAuth token. |
| `baseUrl` | `string` | `"https://tsukyio.com"` | Custom API base URL for staging or local testing. |
| `timeoutMs` | `number` | `30000` (30s) | Request timeout limit in milliseconds. |
| `maxRetries` | `number` | `3` | Number of automatic retries on rate limits (429) or transient network errors. |

### Example: Custom Timeout & Staging Environment

```typescript
const tsukyio = createTsukyioClient({
  apiKey: "tsk_live_1234567890",
  baseUrl: "https://staging.tsukyio.com",
  timeoutMs: 60000, // 60 seconds
  maxRetries: 5,
});
```

---

## 🔄 Dynamic Token Updates

If your application refreshes OAuth access tokens or changes active accounts at runtime:

```typescript
// Update API key dynamically
tsukyio.setApiKey("tsk_new_key");

// Update OAuth Bearer token dynamically
tsukyio.setAccessToken("bearer_oauth_token");
```

---

## 🌐 Runtime Compatibility

`tsukyio-sdk` is built without Node.js-exclusive C++ addons or heavy binary dependencies. It is 100% compatible with:
- **Node.js**: v18.0.0+
- **Bun**: v1.0.0+
- **Deno**: v1.30+
- **Web Browsers**: Modern Chrome, Firefox, Safari, Edge
- **Desktop**: Electron, Tauri
- **Adobe Creative Cloud**: Adobe After Effects CEP & UXP Panels
