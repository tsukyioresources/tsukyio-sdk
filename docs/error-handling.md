# Error Handling & Resilience

The Tsukyio SDK provides typed exception classes to handle HTTP errors, invalid credentials, rate limits, and asynchronous task timeouts gracefully.

---

## 🛑 Error Hierarchy

All SDK exceptions inherit from the base `TsukyioError`.

```
TsukyioError (Base)
├── AuthenticationError  (401 / 403 - Invalid or expired API Key / Token)
├── RateLimitError       (429 - Rate limit exceeded)
├── NotFoundError        (404 - Asset or endpoint not found)
├── ValidationError      (400 - Invalid request parameters)
├── ServerError          (500 - Upstream server error)
└── TaskTimeoutError     (408 - Asynchronous background worker timeout)
```

---

## 🛠 Catching Specific Errors

```typescript
import {
  createTsukyioClient,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  TaskTimeoutError,
  TsukyioError,
} from "tsukyio-sdk";

const tsukyio = createTsukyioClient({ apiKey: "tsk_..." });

try {
  const asset = await tsukyio.vault.getAsset("non-existent-id");
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Authentication failed. Please check your API key.");
  } else if (error instanceof RateLimitError) {
    console.warn(`Rate limited. Retry after ${error.retryAfter} seconds.`);
  } else if (error instanceof NotFoundError) {
    console.warn("Asset could not be found.");
  } else if (error instanceof TaskTimeoutError) {
    console.error("AI background worker took too long to complete.");
  } else if (error instanceof TsukyioError) {
    console.error(`Tsukyio API error (${error.statusCode}): ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

---

## 🔄 Automatic Retry & Backoff

The SDK automatically intercepts HTTP 429 (Rate Limit) and transient network disconnects:
- Inspects the `Retry-After` header sent by the server.
- Automatically pauses and retries the request with exponential backoff up to `maxRetries` (default: `3`).
