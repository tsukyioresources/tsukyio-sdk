import { HttpClient } from "../http.js";
import { GlobalSearchResult } from "../types/stats.js";

export class SearchModule {
  constructor(private http: HttpClient) {}

  /**
   * Search across the entire Tsukyio platform (Vault items, Tools, AMVs, Creators).
   */
  public async query(term: string): Promise<GlobalSearchResult> {
    return this.http.request<GlobalSearchResult>("/api/search/global", {
      params: { q: term },
    });
  }
}
