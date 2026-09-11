export interface DropPublisher {
  id?: string;
  name: string;
  username?: string;
  image?: string | null;
  role?: string;
}

export interface DropAnnouncement {
  id: string;
  folderName: string;
  category: string;
  relPath: string;
  itemCount: number;
  isNsfw: boolean;
  thumbnailUrl: string | null;
  customNotes: string | null;
  pingType: "none" | "here" | "everyone" | string;
  publisher: string;
  publisherImage: string | null;
  announcedAt: string;
  vaultUrl: string;
}
