export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  retryAfter?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
}


export interface ClientOptions {
  /**
   * Tsukyio API Key (e.g. `tsk_live_...`) or OAuth 2.0 Access Token (`tsk_at_...`)
   */
  apiKey?: string;
  /**
   * Base API URL. Defaults to official `https://tsukyio.com`
   */
  baseUrl?: string;
  /**
   * Request timeout in milliseconds. Defaults to 30000 (30 seconds).
   */
  timeoutMs?: number;
  /**
   * Maximum retry attempts on 429 Rate Limits or network interruptions. Defaults to 3.
   */
  maxRetries?: number;
}

export type TsukyioClientOptions = ClientOptions;

