import { HttpClient } from "../http.js";
import { ToolTaskHandle } from "./tools.js";

export interface AudioConversionOptions {
  inputUrl?: string;
  targetFormat: "mp3" | "wav" | "flac" | "aac" | "ogg" | "m4a";
  bitrate?: "128" | "192" | "256" | "320";
  sampleRate?: number;
}

export interface VideoConversionOptions {
  inputUrl?: string;
  targetFormat: "mp4" | "webm" | "mov" | "mkv" | "avi" | "gif";
  resolution?: "source" | "1080p" | "720p" | "4k";
  fps?: number;
  crf?: number;
}

export interface ImageConversionOptions {
  inputUrl?: string;
  targetFormat: "png" | "jpg" | "webp" | "avif" | "ico";
  quality?: number;
  width?: number;
  height?: number;
}

export interface MediaConversionResult {
  outputUrl: string;
  format: string;
  fileSize: number;
  duration?: number;
}

export class ConvertersModule {
  constructor(private http: HttpClient) {}

  /**
   * Convert an audio stream or file to specified format & bitrate.
   */
  public async convertAudio(options: AudioConversionOptions): Promise<ToolTaskHandle<MediaConversionResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/toolkit/converters/audio", {
      method: "POST",
      body: options,
    });
    return new ToolTaskHandle<MediaConversionResult>(res.taskId, this.http);
  }

  /**
   * Convert a video or animation to specified format, resolution & container.
   */
  public async convertVideo(options: VideoConversionOptions): Promise<ToolTaskHandle<MediaConversionResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/toolkit/converters/video", {
      method: "POST",
      body: options,
    });
    return new ToolTaskHandle<MediaConversionResult>(res.taskId, this.http);
  }

  /**
   * Convert and resize images to modern web & VFX formats.
   */
  public async convertImage(options: ImageConversionOptions): Promise<ToolTaskHandle<MediaConversionResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/toolkit/converters/image", {
      method: "POST",
      body: options,
    });
    return new ToolTaskHandle<MediaConversionResult>(res.taskId, this.http);
  }
}
