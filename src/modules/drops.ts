import { HttpClient } from "../http.js";
import { DropAnnouncement } from "../types/drops.js";
import { PaginatedResponse } from "../types/common.js";

export class DropsModule {
  constructor(private http: HttpClient) {}

  /**
   * List recent vault drop announcements.
   */
  public async list(options: { page?: number; limit?: number; category?: string } = {}): Promise<PaginatedResponse<DropAnnouncement>> {
    const params: Record<string, string | number> = {};
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.category) params.category = options.category;

    return this.http.request<PaginatedResponse<DropAnnouncement>>("/api/drops", { params });
  }

  /**
   * Get latest featured drop announcement.
   */
  public async getLatest(): Promise<DropAnnouncement | null> {
    const res = await this.list({ limit: 1 });
    return res.data[0] || null;
  }
}
