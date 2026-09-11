export interface GlobalStats {
  vault: {
    totalAssets: number;
    totalFiles: number;
    totalFolders: number;
    categories: Array<{
      id: string;
      folder: string;
      assets: number;
      files: number;
    }>;
  };
  tools: {
    total: number;
    active: number;
  };
  showcase: {
    totalEdits: number;
    activeEdits: number;
  };
}

export interface GlobalSearchResult {
  query: string;
  total: number;
  results: {
    vault: Array<{
      id: string;
      name: string;
      category: string;
      relPath: string;
      type: string;
      thumbnail?: string | null;
    }>;
    tools: Array<{
      id: string;
      name: string;
      description?: string;
      link: string;
      category?: string;
    }>;
    edits: Array<{
      id: string;
      title: string;
      editor: string;
      anime?: string;
      thumbnailUrl?: string;
    }>;
    creators: Array<{
      id: string;
      name: string;
      image?: string;
      url?: string;
    }>;
  };
}
