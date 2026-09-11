import { HttpClient } from "../http.js";
import { ProjectFile, ProjectsFilterOptions } from "../types/projects.js";
import { PaginatedResponse } from "../types/common.js";

export class ProjectsModule {
  constructor(private http: HttpClient) {}

  /**
   * List community project files (After Effects, Premiere, Blender, DaVinci).
   */
  public async list(options: ProjectsFilterOptions = {}): Promise<PaginatedResponse<ProjectFile>> {
    const params: Record<string, string | number> = {};
    if (options.software) params.software = options.software;
    if (options.category) params.category = options.category;
    if (options.minPlan) params.minPlan = options.minPlan;
    if (options.search) params.search = options.search;
    if (options.sort) params.sort = options.sort;
    if (options.userId) params.userId = options.userId;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;

    return this.http.request<PaginatedResponse<ProjectFile>>("/api/projects", { params });
  }

  /**
   * Get single project details by ID.
   */
  public async getById(id: string): Promise<ProjectFile> {
    return this.http.request<ProjectFile>(`/api/projects/${encodeURIComponent(id)}`);
  }

  /**
   * Get signed download URL for project assets.
   */
  public async getDownloadUrl(id: string): Promise<{ downloadUrl: string; expiresAt: string }> {
    return this.http.request<{ downloadUrl: string; expiresAt: string }>(
      `/api/projects/${encodeURIComponent(id)}/download`,
      { method: "POST" }
    );
  }
}
