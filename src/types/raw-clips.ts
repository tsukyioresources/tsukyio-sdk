export interface RawEpisode {
  id: string;
  name: string;
  path: string;
  relPath: string;
  size: number;
  thumbnail: string | null;
  type: string;
  mtime: string;
  metadata?: Record<string, unknown>;
}

export interface RawAnimeCollection {
  id: string;
  animeName: string;
  folderPath: string;
  thumbnail: string;
  episodeCount: number;
  totalSize: number;
  episodes: RawEpisode[];
  firstLetter: string;
  latestMtime: string;
}

export interface RawClipsFilterOptions {
  search?: string;
  letter?: string;
  sortBy?: "name" | "episodes";
  page?: number;
  limit?: number;
}
