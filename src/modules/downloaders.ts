import { HttpClient } from "../http.js";
import { ToolTaskHandle } from "./tools.js";

export type AudioBitrate = "128" | "192" | "256" | "320";
export type VideoQuality = "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "best";

export interface MediaDownloadResult {
  title: string;
  author?: string;
  duration?: number;
  thumbnailUrl?: string;
  downloadUrl: string;
  fileSize?: number;
  format: string;
  quality?: string;
}

export interface YouTubeDownloadOptions {
  url: string;
  format?: "mp4" | "mp3" | "wav";
  quality?: VideoQuality;
  bitrate?: AudioBitrate;
  fps60?: boolean;
}

export interface SpotifyDownloadOptions {
  url: string;
  format?: "mp3" | "flac" | "wav";
  bitrate?: AudioBitrate;
}

export interface SoundCloudDownloadOptions {
  url: string;
  format?: "mp3" | "wav" | "flac";
  bitrate?: AudioBitrate;
}

export interface SocialDownloadOptions {
  url: string;
  noWatermark?: boolean;
  format?: "mp4" | "mp3";
}

export class DownloadersModule {
  constructor(private http: HttpClient) {}

  /**
   * Universal downloader dispatcher.
   */
  public async download(url: string, options: Record<string, unknown> = {}): Promise<ToolTaskHandle<MediaDownloadResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/tools/tasks", {
      method: "POST",
      body: {
        tool: "downloader",
        params: { url, ...options },
      },
    });
    return new ToolTaskHandle<MediaDownloadResult>(res.taskId, this.http);
  }

  /**
   * Download YouTube Video or Audio with 60fps & 4K support.
   */
  public async youtube(options: YouTubeDownloadOptions): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(options.url, {
      type: options.format === "mp3" || options.format === "wav" ? "audio" : "video",
      format: options.format || "mp4",
      quality: options.quality || "1080p",
      bitrate: options.bitrate || "320",
      fps60: options.fps60 ?? true,
    });
  }

  /**
   * Download track from Spotify with ID3 metadata and album art.
   */
  public async spotify(options: SpotifyDownloadOptions): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(options.url, {
      source: "spotify",
      format: options.format || "mp3",
      bitrate: options.bitrate || "320",
    });
  }

  /**
   * Download high-bitrate audio from SoundCloud.
   */
  public async soundcloud(options: SoundCloudDownloadOptions): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(options.url, {
      source: "soundcloud",
      format: options.format || "mp3",
      bitrate: options.bitrate || "320",
    });
  }

  /**
   * Download TikTok video without watermark.
   */
  public async tiktok(options: SocialDownloadOptions): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(options.url, {
      source: "tiktok",
      noWatermark: options.noWatermark ?? true,
      format: options.format || "mp4",
    });
  }

  /**
   * Download Instagram Reel, Post, or Carousel.
   */
  public async instagram(options: SocialDownloadOptions): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(options.url, {
      source: "instagram",
      format: options.format || "mp4",
    });
  }

  /**
   * Download Twitter / X video.
   */
  public async twitter(url: string): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(url, { source: "twitter" });
  }

  /**
   * Download Twitch clip or VOD segment.
   */
  public async twitch(url: string, quality?: VideoQuality): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(url, { source: "twitch", quality: quality || "1080p" });
  }

  /**
   * Download Pinterest video or high-res image.
   */
  public async pinterest(url: string): Promise<ToolTaskHandle<MediaDownloadResult>> {
    return this.download(url, { source: "pinterest" });
  }
}
