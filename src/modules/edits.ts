import { HttpClient } from "../http.js";
import type { CinematicEdit } from "../types/edits.js";

export class EditsModule {
  constructor(private http: HttpClient) {}

  /**
   * List curated cinematic AMV & anime edits.
   */
  public async list(options: { limit?: number } = {}): Promise<CinematicEdit[]> {
    const res = await this.http.request<{ success: boolean; edits: CinematicEdit[] }>("/api/edits/random", {
      params: { limit: options.limit || 20 },
    });
    return res.edits || [];
  }

  /**
   * Get random featured cinematic AMV edits.
   */
  public async getRandom(limit = 15): Promise<CinematicEdit[]> {
    return this.list({ limit });
  }

}
