import { HttpClient } from "../http.js";
import { GlobalStats } from "../types/stats.js";

export class StatsModule {
  constructor(private http: HttpClient) {}

  /**
   * Fetch global platform ecosystem statistics (Vault asset count, active tools, showcase metrics).
   */
  public async getGlobal(): Promise<GlobalStats> {
    return this.http.request<GlobalStats>("/api/stats/global");
  }
}
