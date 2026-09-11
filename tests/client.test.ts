import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TsukyioClient, createTsukyioClient } from "../src/index.js";
import { AuthenticationError, RateLimitError, NotFoundError, TaskTimeoutError } from "../src/errors.js";

describe("Tsukyio SDK Client", () => {
  let client: TsukyioClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = createTsukyioClient({
      apiKey: "tsk_test_123456",
      baseUrl: "https://tsukyio.com",
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should initialize all modules successfully", () => {
    expect(client.vault).toBeDefined();
    expect(client.rawClips).toBeDefined();
    expect(client.tools).toBeDefined();
    expect(client.downloaders).toBeDefined();
    expect(client.converters).toBeDefined();
    expect(client.afterEffects).toBeDefined();
    expect(client.drops).toBeDefined();
    expect(client.projects).toBeDefined();
    expect(client.edits).toBeDefined();
    expect(client.search).toBeDefined();
    expect(client.stats).toBeDefined();
    expect(client.oauth).toBeDefined();
  });

  it("should dynamically allow updating auth tokens", () => {
    client.setApiKey("tsk_new_key");
    client.setAccessToken("bearer_oauth_token");
    expect(client).toBeInstanceOf(TsukyioClient);
  });

  it("should attach Authorization & X-API-Key headers correctly", async () => {
    let capturedHeaders: HeadersInit | undefined;

    globalThis.fetch = vi.fn().mockImplementation((url, init) => {
      capturedHeaders = init?.headers;
      return Promise.resolve(new Response(JSON.stringify({ success: true, data: { status: "ok" } }), { status: 200 }));
    });

    await client.stats.getGlobal();

    expect(capturedHeaders).toBeDefined();
    const headers = capturedHeaders as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer tsk_test_123456");
    expect(headers["X-API-Key"]).toBe("tsk_test_123456");
  });

  it("should throw AuthenticationError on 401 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Invalid API key" }), { status: 401 })
    );

    await expect(client.vault.list()).rejects.toThrow(AuthenticationError);
  });

  it("should throw NotFoundError on 404 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    );

    await expect(client.projects.getById("unknown-id")).rejects.toThrow(NotFoundError);
  });

  it("should handle ToolTaskHandle polling with progress callbacks", async () => {
    let pollCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/tools/tasks/task-abc-123")) {
        pollCount++;
        if (pollCount === 1) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                taskId: "task-abc-123",
                status: "processing",
                progress: 50,
              }),
              { status: 200 }
            )
          );
        }
        return Promise.resolve(
          new Response(
            JSON.stringify({
              taskId: "task-abc-123",
              status: "completed",
              progress: 100,
              result: { vocalsUrl: "https://storage.tsukyio.com/vocals.mp3" },
            }),
            { status: 200 }
          )
        );
      }
      return Promise.resolve(
        new Response(JSON.stringify({ taskId: "task-abc-123" }), { status: 200 })
      );
    });

    const task = await client.tools.splitAudio({ audioUrl: "https://test.com/audio.mp3" });
    const progressList: number[] = [];

    const result = await task.waitForCompletion({
      intervalMs: 10,
      onProgress: (status) => {
        if (status.progress) progressList.push(status.progress);
      },
    });

    expect(result.vocalsUrl).toBe("https://storage.tsukyio.com/vocals.mp3");
    expect(progressList).toContain(50);
  });
});
