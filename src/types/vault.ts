import type { components } from "./generated.js";

export type VaultCategory = components["schemas"]["VaultCategory"];
export type VaultAsset = components["schemas"]["VaultAsset"];
export type VaultListResponse = components["schemas"]["VaultListResponse"];
export type SignedDownloadToken = components["schemas"]["VaultDownloadToken"];

export interface VaultListOptions {
  category?: VaultCategory | string;
  path?: string;
  search?: string;
  limit?: number;
  page?: number;
}
