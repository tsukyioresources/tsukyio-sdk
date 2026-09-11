import { ClientOptions, ApiResponse } from "./types/common.js";
import {
  TsukyioError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
} from "./errors.js";

export class HttpClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl || "https://tsukyio.com").replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? 30000;
    this.maxRetries = options.maxRetries ?? 3;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public setAccessToken(token: string) {
    this.apiKey = token;
  }


  public async request<T = unknown>(
    path: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      params?: Record<string, string | number | boolean | undefined | null>;
      body?: unknown;
      headers?: Record<string, string>;
      isFormData?: boolean;
    } = {}
  ): Promise<T> {
    const { method = "GET", params, body, headers = {}, isFormData = false } = options;

    let url = path.startsWith("http") ? path : `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes("?") ? "&" : "?") + qs;
      }
    }

    const requestHeaders: Record<string, string> = {
      Accept: "application/json",
      ...headers,
    };

    if (this.apiKey) {
      requestHeaders["Authorization"] = `Bearer ${this.apiKey}`;
      requestHeaders["X-API-Key"] = this.apiKey;
    }

    let requestBody: any;
    if (body) {
      if (isFormData) {
        requestBody = body;
      } else {
        requestHeaders["Content-Type"] = "application/json";
        requestBody = JSON.stringify(body);
      }
    }

    let attempts = 0;

    while (attempts <= this.maxRetries) {
      attempts++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: requestBody,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle Rate Limiting with intelligent backoff
        if (response.status === 429) {
          const retryAfterSec = parseInt(response.headers.get("Retry-After") || "2", 10);
          if (attempts <= this.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, Math.max(1000, retryAfterSec * 1000)));
            continue;
          }
          throw new RateLimitError("Rate limit exceeded", retryAfterSec);
        }

        if (response.status === 401 || response.status === 403) {
          const errJson = (await response.json().catch(() => ({}))) as ApiResponse;
          throw new AuthenticationError(errJson.error || "Authentication failed with Tsukyio API");
        }

        if (response.status === 404) {
          const errJson = (await response.json().catch(() => ({}))) as ApiResponse;
          throw new NotFoundError(errJson.error || `Endpoint or asset not found: ${url}`);
        }

        const data = (await response.json().catch(() => null)) as any;

        if (!response.ok) {
          const errorMsg = data?.error || data?.message || `HTTP ${response.status} error`;
          throw new TsukyioError(errorMsg, response.status, data);
        }

        // Return extracted data if in standard { success: true, data: ... } envelope, otherwise raw payload
        if (data && typeof data === "object" && "success" in data && "data" in data) {
          return data.data as T;
        }

        return data as T;
      } catch (err: any) {
        clearTimeout(timeoutId);

        if (err.name === "AbortError") {
          throw new TsukyioError(`Request timed out after ${this.timeoutMs}ms`, 408);
        }

        if (err instanceof TsukyioError) {
          throw err;
        }

        if (attempts > this.maxRetries) {
          throw new TsukyioError(err?.message || "Network request failed", undefined, err);
        }

        // Exponential backoff before next attempt
        await new Promise((resolve) => setTimeout(resolve, attempts * 500));
      }
    }

    throw new TsukyioError("Request failed after maximum retries");
  }
}
