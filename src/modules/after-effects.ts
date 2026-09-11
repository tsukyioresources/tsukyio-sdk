import { HttpClient } from "../http.js";
import { ToolTaskHandle } from "./tools.js";

export type AEVersion = "2024" | "2023" | "2022" | "2021" | "2020" | "CC17" | "CC16" | "CC15" | "CC14" | "CS6";

export interface AepDowngradeOptions {
  fileUrl?: string;
  targetVersion: AEVersion;
}

export interface FfxDowngradeOptions {
  fileUrl?: string;
  targetVersion: AEVersion;
}

export interface AepInspectionResult {
  projectName: string;
  aeVersion: string;
  createdVersion: string;
  compositionsCount: number;
  layersCount: number;
  fontsUsed: string[];
  pluginsUsed: string[];
  missingFootage: string[];
  expressionErrors: string[];
}

export interface DowngradeResult {
  outputUrl: string;
  downgradedTo: string;
  originalVersion: string;
  fileSize: number;
}

export class AfterEffectsModule {
  constructor(private http: HttpClient) {}

  /**
   * Downgrade Adobe After Effects project (.aep) to an older version.
   */
  public async downgradeAep(options: AepDowngradeOptions): Promise<ToolTaskHandle<DowngradeResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/toolkit/aep-downgrader", {
      method: "POST",
      body: options,
    });
    return new ToolTaskHandle<DowngradeResult>(res.taskId, this.http);
  }

  /**
   * Downgrade Adobe After Effects preset (.ffx) to an older version.
   */
  public async downgradeFfx(options: FfxDowngradeOptions): Promise<ToolTaskHandle<DowngradeResult>> {
    const res = await this.http.request<{ taskId: string }>("/api/toolkit/ffx-downgrader", {
      method: "POST",
      body: options,
    });
    return new ToolTaskHandle<DowngradeResult>(res.taskId, this.http);
  }

  /**
   * Inspect and diagnose an Adobe After Effects project file for missing fonts, plugins, and dependencies.
   */
  public async inspectAep(fileUrl: string): Promise<AepInspectionResult> {
    return this.http.request<AepInspectionResult>("/api/toolkit/aep-inspector", {
      method: "POST",
      body: { fileUrl },
    });
  }
}
