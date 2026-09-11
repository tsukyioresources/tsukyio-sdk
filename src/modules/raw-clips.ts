import { HttpClient } from "../http.js";
import type { RawAnimeCollection, RawClipsFilterOptions } from "../types/raw-clips.js";

export class RawClipsModule {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all curated raw anime collections with cover posters and episode counts.
   */
  public async listCollections(options: RawClipsFilterOptions = {}): Promise<RawAnimeCollection[]> {
    const rawRes = await this.http.request<{ items: any[] }>("/api/vault/list", {
      method: "GET",
      params: {
        category: "raw",
        search: options.search,
      },
    });

    const items = rawRes.items || [];
    // Aggregate hierarchical anime folders
    const animeMap = new Map<string, RawAnimeCollection>();

    for (const item of items) {
      if (item.type === "folder") continue;
      const fullPath = (item.path || item.relPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
      const parts = fullPath.split("/").filter(Boolean);

      let animeName = "General Anime Clips";
      let folderPath = "Raw";

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i].toLowerCase();
        if (p === "episodes raw" || p === "episodes_raw" || p === "episodes-raw" || p === "episodes") {
          if (i + 1 < parts.length) {
            animeName = parts[i + 1];
            folderPath = parts.slice(0, i + 2).join("/");
          }
          break;
        }
      }

      if (animeName === "General Anime Clips" && parts.length >= 2) {
        animeName = parts[1];
        folderPath = parts.slice(0, 2).join("/");
      }

      const cleanName = animeName.replace(/[_\-]+/g, " ").replace(/\[.*?\]|\(.*?\)/g, "").trim();
      const key = cleanName.toLowerCase();

      if (!animeMap.has(key)) {
        const firstChar = cleanName.charAt(0).toUpperCase();
        animeMap.set(key, {
          id: `anime-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          animeName: cleanName,
          folderPath,
          thumbnail: item.thumbnail || "/default-thumbnail.png",
          episodeCount: 0,
          totalSize: 0,
          episodes: [],
          firstLetter: /[A-Z]/.test(firstChar) ? firstChar : "#",
          latestMtime: item.mtime,
        });
      }

      const collection = animeMap.get(key)!;
      collection.episodes.push({
        id: item.id,
        name: item.name,
        path: item.path,
        relPath: item.relPath,
        size: item.size || 0,
        thumbnail: item.thumbnail || null,
        type: item.type,
        mtime: item.mtime,
      });
      collection.episodeCount++;
      collection.totalSize += item.size || 0;
    }

    let collections = Array.from(animeMap.values());

    if (options.letter && options.letter !== "ALL") {
      if (options.letter === "#") {
        collections = collections.filter((c) => !/^[A-Z]/i.test(c.animeName.charAt(0)));
      } else {
        collections = collections.filter((c) => c.animeName.toUpperCase().startsWith(options.letter!));
      }
    }

    if (options.sortBy === "episodes") {
      collections.sort((a, b) => b.episodeCount - a.episodeCount);
    } else {
      collections.sort((a, b) => a.animeName.localeCompare(b.animeName));
    }

    return collections;
  }

  /**
   * Get Range-streaming URL for in-browser playback or high-speed scrubbing.
   */
  public getStreamUrl(filePath: string): string {
    return `/api/stream?file=${encodeURIComponent(filePath)}`;
  }
}
