export type TaskStatusState = "pending" | "processing" | "completed" | "failed";

export interface TaskStatus<T = Record<string, unknown>> {
  taskId: string;
  status: TaskStatusState;
  progress?: number;
  message?: string;
  result?: T;
  outputUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SplitterResult {
  vocalsUrl?: string;
  drumsUrl?: string;
  bassUrl?: string;
  otherUrl?: string;
  duration?: number;
}

export interface DeadframeResult {
  outputUrl: string;
  cleanedFramesCount: number;
  duration: number;
}

export interface SceneSplitterResult {
  clips: Array<{
    name: string;
    start: number;
    end: number;
    url: string;
  }>;
  totalScenes: number;
}

export interface AnimeSearchResult {
  anime: string;
  episode: number | string;
  similarity: number;
  timestamp: string;
  videoPreviewUrl?: string;
  imagePreviewUrl?: string;
}

export interface SongFinderResult {
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}
