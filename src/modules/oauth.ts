import { HttpClient } from "../http.js";
import { AuthenticationError, TsukyioError } from "../errors.js";

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export class OAuthModule {
  constructor(private http: HttpClient) {}

  /**
   * Request a device code for CLI, Desktop, or After Effects extensions (RFC 8628).
   */
  public async requestDeviceCode(clientId: string, scope = "profile:read"): Promise<DeviceCodeResponse> {
    return this.http.request<DeviceCodeResponse>("/api/oauth/device/code", {
      method: "POST",
      body: { client_id: clientId, scope },
    });
  }

  /**
   * Poll for OAuth token once user completes web approval.
   */
  public async pollDeviceToken(options: {
    clientId: string;
    deviceCode: string;
    intervalSec?: number;
    timeoutSec?: number;
    onWaiting?: () => void;
  }): Promise<OAuthTokenResponse> {
    const intervalSec = options.intervalSec || 5;
    const timeoutSec = options.timeoutSec || 300;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutSec * 1000) {
      try {
        const tokenRes = await this.http.request<OAuthTokenResponse>("/api/oauth/token", {
          method: "POST",
          body: {
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
            client_id: options.clientId,
            device_code: options.deviceCode,
          },
        });

        if (tokenRes && tokenRes.access_token) {
          return tokenRes;
        }
      } catch (err: any) {
        if (err?.message?.includes("authorization_pending")) {
          if (options.onWaiting) options.onWaiting();
        } else if (err?.message?.includes("slow_down")) {
          await new Promise((r) => setTimeout(r, (intervalSec + 5) * 1000));
          continue;
        } else if (err?.message?.includes("expired_token") || err?.message?.includes("access_denied")) {
          throw new AuthenticationError(err.message);
        }
      }

      await new Promise((r) => setTimeout(r, intervalSec * 1000));
    }

    throw new TsukyioError(`Device code authorization timed out after ${timeoutSec} seconds.`);
  }

  /**
   * Refresh an expired access token using a refresh token.
   */
  public async refreshToken(clientId: string, refreshToken: string): Promise<OAuthTokenResponse> {
    return this.http.request<OAuthTokenResponse>("/api/oauth/token", {
      method: "POST",
      body: {
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
      },
    });
  }
}
