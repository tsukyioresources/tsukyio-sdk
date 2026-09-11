# OAuth 2.0 Device Flow (`tsukyio.oauth`)

The **OAuth Module** provides an implementation of the **RFC 8628 OAuth 2.0 Device Authorization Grant**.

This flow allows desktop applications (e.g. Electron, Tauri, CLI tools) and Adobe After Effects extensions (CEP / UXP) to securely authenticate users without handling passwords or hosting embedded webviews.

---

## 🔄 Authentication Workflow

```
+----------------+      +-------------------+      +--------------------+
|  Desktop / AE  |      |   Tsukyio SDK     |      | Tsukyio Web Server |
|   Extension    |      |  (Client-side)    |      |  (https://tsukyio) |
+----------------+      +-------------------+      +--------------------+
       |                          |                          |
       |  1. Request Device Code  |                          |
       |------------------------->|  POST /oauth/device/code |
       |                          |------------------------->|
       |                          |<-------------------------|
       |<-------------------------|  Returns device_code     |
       |  2. Show URL to user     |  & user_code (e.g. ABCD) |
       |                          |                          |
       |  3. User approves in web |                          |
       |     browser window       |                          |
       |                          |  4. Poll for Token       |
       |                          |  POST /oauth/token       |
       |                          |------------------------->|
       |                          |<-------------------------|
       |<-------------------------|  Returns access_token    |
       |  5. Authenticated!       |                          |
```

---

## 💻 Implementation Example

```typescript
import { createTsukyioClient } from "tsukyio-sdk";

const tsukyio = createTsukyioClient();
const CLIENT_ID = "YOUR_DESKTOP_CLIENT_ID";

async function loginUser() {
  // Step 1: Request Device Authorization Code
  const device = await tsukyio.oauth.requestDeviceCode(CLIENT_ID, "profile:read vault:read");

  console.log("\n=================================================");
  console.log(`👉 Please open: ${device.verification_uri_complete}`);
  console.log(`   Or visit ${device.verification_uri} and enter: ${device.user_code}`);
  console.log("=================================================\n");

  // Step 2: Poll for user approval
  const token = await tsukyio.oauth.pollDeviceToken({
    clientId: CLIENT_ID,
    deviceCode: device.device_code,
    intervalSec: device.interval || 5,
    onWaiting: () => {
      console.log("⏳ Waiting for approval in browser...");
    },
  });

  console.log("🎉 Successfully authenticated!");
  console.log("Access Token:", token.access_token);

  // Step 3: Attach token to the Tsukyio client
  tsukyio.setAccessToken(token.access_token);

  return token;
}

// Step 4: Refresh token when expired
async function refreshSession(refreshToken: string) {
  const refreshed = await tsukyio.oauth.refreshToken(CLIENT_ID, refreshToken);
  tsukyio.setAccessToken(refreshed.access_token);
  return refreshed;
}
```
