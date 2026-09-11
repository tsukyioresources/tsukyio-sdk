import { HttpClient } from "./http.js";
import { TsukyioClientOptions } from "./types/common.js";
import { VaultModule } from "./modules/vault.js";
import { RawClipsModule } from "./modules/raw-clips.js";
import { ToolsModule } from "./modules/tools.js";
import { DownloadersModule } from "./modules/downloaders.js";
import { ConvertersModule } from "./modules/converters.js";
import { AfterEffectsModule } from "./modules/after-effects.js";
import { DropsModule } from "./modules/drops.js";
import { ProjectsModule } from "./modules/projects.js";
import { EditsModule } from "./modules/edits.js";
import { SearchModule } from "./modules/search.js";
import { StatsModule } from "./modules/stats.js";
import { OAuthModule } from "./modules/oauth.js";

/**
 * Tsukyio SDK Client
 *
 * Official TypeScript/JavaScript client for interacting with the Tsukyio Creator Ecosystem.
 * Provides unified access to the Vault, Anime Raw Clips, AI Tools, Downloaders, Downgraders, Projects, and Edits.
 */
export class TsukyioClient {
  public readonly vault: VaultModule;
  public readonly rawClips: RawClipsModule;
  public readonly tools: ToolsModule;
  public readonly downloaders: DownloadersModule;
  public readonly converters: ConvertersModule;
  public readonly afterEffects: AfterEffectsModule;
  public readonly drops: DropsModule;
  public readonly projects: ProjectsModule;
  public readonly edits: EditsModule;
  public readonly search: SearchModule;
  public readonly stats: StatsModule;
  public readonly oauth: OAuthModule;

  private http: HttpClient;

  constructor(options: TsukyioClientOptions = {}) {
    this.http = new HttpClient(options);

    this.vault = new VaultModule(this.http);
    this.rawClips = new RawClipsModule(this.http);
    this.tools = new ToolsModule(this.http);
    this.downloaders = new DownloadersModule(this.http);
    this.converters = new ConvertersModule(this.http);
    this.afterEffects = new AfterEffectsModule(this.http);
    this.drops = new DropsModule(this.http);
    this.projects = new ProjectsModule(this.http);
    this.edits = new EditsModule(this.http);
    this.search = new SearchModule(this.http);
    this.stats = new StatsModule(this.http);
    this.oauth = new OAuthModule(this.http);
  }

  /**
   * Update the API key dynamically on the existing client instance.
   */
  public setApiKey(apiKey: string): void {
    this.http.setApiKey(apiKey);
  }

  /**
   * Update the Bearer OAuth access token dynamically.
   */
  public setAccessToken(token: string): void {
    this.http.setAccessToken(token);
  }
}

/**
 * Factory helper to instantiate a new TsukyioClient.
 */
export function createTsukyioClient(options: TsukyioClientOptions = {}): TsukyioClient {
  return new TsukyioClient(options);
}
