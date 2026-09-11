import { HttpClient } from "../http.js";
import {
  TaskStatus,
  SplitterResult,
  DeadframeResult,
  SceneSplitterResult,
  AnimeSearchResult,
  SongFinderResult,
} from "../types/tools.js";
import { TaskTimeoutError, TsukyioError } from "../errors.js";

export class ToolTaskHandle<T = Record<string, unknown>> {
  constructor(
    public readonly taskId: string,
    private http: HttpClient
  ) {}

  /**
   * Fetch current task progress and status.
   */
  public async getStatus(): Promise<TaskStatus<T>> {
    return this.http.request<TaskStatus<T>>(`/api/tools/tasks/${encodeURIComponent(this.taskId)}`);
  }

  /**
   * Purge task cache and files from server.
   */
  public async purge(): Promise<boolean> {
    const res = await this.http.request<{ purged: boolean }>(
      `/api/tools/tasks/${encodeURIComponent(this.taskId)}`,
      { method: "DELETE" }
    );
    return res.purged === true;
  }

  /**
   * Poll until the background task completes, fails, or times out.
   */
  public async waitForCompletion(options: {
    intervalMs?: number;
    timeoutMs?: number;
    onProgress?: (status: TaskStatus<T>) => void;
  } = {}): Promise<T> {
    const intervalMs = options.intervalMs ?? 1500;
    const timeoutMs = options.timeoutMs ?? 180000; // 3 minutes default
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getStatus();

      if (options.onProgress) {
        options.onProgress(status);
      }

      if (status.status === "completed") {
        return (status.result || (status as any)) as T;
      }

      if (status.status === "failed") {
        throw new TsukyioError(status.error || "Background task failed during execution");
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new TaskTimeoutError(`Task ${this.taskId} did not finish within ${timeoutMs}ms`);
  }
}

export class ToolsModule {
  constructor(private http: HttpClient) {}

  /**
   * Dispatch a generic tool task by tool ID.
   */
  public async dispatch<T = Record<string, unknown>>(
    toolId: string,
    params: Record<string, unknown> = {}
  ): Promise<ToolTaskHandle<T>> {
    const res = await this.http.request<{ taskId: string }>("/api/tools/tasks", {
      method: "POST",
      body: { tool: toolId, params },
    });
    return new ToolTaskHandle<T>(res.taskId, this.http);
  }

  /**
   * AI Demucs 4-Stem Audio Separator (Vocals, Drums, Bass, Other).
   */
  public async splitAudio(options: {
    audioUrl?: string;
    stems?: 2 | 4;
  }): Promise<ToolTaskHandle<SplitterResult>> {
    return this.dispatch<SplitterResult>("audio_splitter", {
      url: options.audioUrl,
      stems: options.stems || 4,
    });
  }

  /**
   * AMVerge Deadframe and duplicate black frame cleaner.
   */
  public async cleanDeadframes(options: {
    videoUrl?: string;
    threshold?: number;
  }): Promise<ToolTaskHandle<DeadframeResult>> {
    return this.dispatch<DeadframeResult>("deadframes", options);
  }

  /**
   * AMVerge AI Scene Cut Splitter.
   */
  public async splitScenes(options: {
    videoUrl?: string;
    threshold?: number;
  }): Promise<ToolTaskHandle<SceneSplitterResult>> {
    return this.dispatch<SceneSplitterResult>("scene_splitter", options);
  }

  /**
   * Reverse Image Anime Scene Search (powered by trace.moe).
   */
  public async findAnime(imageUrl: string): Promise<AnimeSearchResult[]> {
    const res = await this.http.request<{ results: AnimeSearchResult[] }>("/api/toolkit/anime", {
      method: "POST",
      body: { image: imageUrl },
    });
    return res.results || [];
  }

  /**
   * Audio Shazam & song identification.
   */
  public async findSong(audioUrl: string): Promise<SongFinderResult> {
    return this.http.request<SongFinderResult>("/api/toolkit/song", {
      method: "POST",
      body: { url: audioUrl },
    });
  }
}
