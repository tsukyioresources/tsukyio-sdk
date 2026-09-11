import { HttpClient } from "../http.js";
import {
  VaultAsset,
  VaultListOptions,
  VaultListResponse,
  SignedDownloadToken,
} from "../types/vault.js";

export class VaultModule {
  constructor(private http: HttpClient) {}

  /**
   * List files and folders in the Tsukyio Vault with optional category and directory path.
   */
  public async list(options: VaultListOptions = {}): Promise<VaultListResponse> {
    return this.http.request<VaultListResponse>("/api/vault/list", {
      method: "GET",
      params: {
        category: options.category,
        path: options.path,
        search: options.search,
        limit: options.limit,
        page: options.page,
      },
    });
  }

  /**
   * Get all official Tsukyio Vault categories.
   */
  public async getCategories(): Promise<string[]> {
    const res = await this.list({ limit: 1 });
    if (res && res.stats) {
      return Object.keys(res.stats);
    }
    return [
      "precuts",
      "raw",
      "flow",
      "presets",
      "vocals",
      "overlays",
      "sfx",
      "remake_clips",
      "green_screen",
      "3d_models",
    ];
  }


  /**
   * Fast search across all Vault assets by filename or partial path.
   */
  public async search(query: string, category?: string): Promise<VaultAsset[]> {
    const res = await this.http.request<{ items: VaultAsset[] }>("/api/vault/search", {
      method: "GET",
      params: { q: query, category },
    });
    return res.items || [];
  }

  /**
   * Deep recursive search inside subfolders and project archives.
   */
  public async deepSearch(query: string, category?: string): Promise<VaultAsset[]> {
    const res = await this.http.request<{ items: VaultAsset[] }>("/api/vault/deep-search", {
      method: "GET",
      params: { q: query, category },
    });
    return res.items || [];
  }

  /**
   * Retrieve a specific Vault asset by its Unique ID.
   */
  public async getAsset(assetId: string): Promise<VaultAsset> {
    return this.http.request<VaultAsset>(`/api/vault/assets/${encodeURIComponent(assetId)}`, {
      method: "GET",
    });
  }

  /**
   * Generate a signed, high-speed download token & URL for an asset (24-hour token by default).
   */
  public async getDownloadToken(assetId: string, expiresInSeconds = 86400): Promise<SignedDownloadToken> {
    return this.http.request<SignedDownloadToken>("/api/vault/download/sign", {
      method: "POST",
      body: { assetId, expiresIn: expiresInSeconds },
    });
  }

  /**
   * Get direct download link for an asset.
   */
  public async getDownloadUrl(assetId: string): Promise<string> {
    const signed = await this.getDownloadToken(assetId);
    return signed.url;
  }
}
