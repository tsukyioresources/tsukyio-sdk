export interface ProjectFile {
  id: string;
  title: string;
  description?: string | null;
  software: string;
  softwareVersion?: string | null;
  category: string;
  minPlan: "FREE" | "SUPPORTER" | "SUPER_SUPPORTER" | string;
  previewUrl?: string | null;
  requiredPlugins: string[];
  animeName?: string | null;
  songName?: string | null;
  downloads: number;
  likes: number;
  author: {
    id: string;
    name: string;
    username?: string;
    image?: string | null;
    role?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsFilterOptions {
  software?: string;
  category?: string;
  minPlan?: string;
  search?: string;
  sort?: "recent" | "downloads" | "likes";
  userId?: string;
  page?: number;
  limit?: number;
}
