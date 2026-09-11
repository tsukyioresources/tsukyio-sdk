export interface CinematicEdit {
  id: string;
  title: string;
  editor: string;
  editorUrl?: string | null;
  editorImage?: string | null;
  anime?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  accentColor?: string | null;
  likes?: number | null;
  views?: number | null;
  duration?: number | null;
}
