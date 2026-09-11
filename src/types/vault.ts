export type VaultCategory =
  | "raw"
  | "precuts"
  | "flow"
  | "presets"
  | "vocals"
  | "overlays"
  | "sfx"
  | "remake_clips"
  | "green_screen"
  | "credits"
  | "edit_audios";

export interface VaultAsset {
  id: string;
  name: string;
  path: string;
  relPath: string;
  type: "file" | "folder" | "video" | "audio" | "image" | "preset" | "archive";
  category: string;
  size: number;
  thumbnail: string | null;
  downloadUrl?: string | null;
  mtime: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultListResponse {
  items: VaultAsset[];
  stats?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SignedDownloadToken {
  token: string;
  url: string;
  expires: number;
  signature: string;
}

export interface VaultListOptions {
  category?: VaultCategory | string;
  path?: string;
  search?: string;
  limit?: number;
  page?: number;
}
