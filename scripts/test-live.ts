import { createTsukyioClient } from "../src/index.js";

const API_KEY = process.env.TSUKYIO_API_KEY || "";
const BASE_URL = process.env.TSUKYIO_BASE_URL || "http://localhost:3000";

if (!API_KEY) {
  console.error("❌ Error: TSUKYIO_API_KEY environment variable is required to run live tests.");
  console.error("Usage: TSUKYIO_API_KEY=tsk_... npx tsx scripts/test-live.ts");
  process.exit(1);
}


console.log(`\n======================================================`);
console.log(`🚀 Starting Tsukyio SDK Live Integration Test Suite`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log(`🔑 Key: ${API_KEY.slice(0, 10)}...${API_KEY.slice(-6)}`);
console.log(`======================================================\n`);

const client = createTsukyioClient({
  apiKey: API_KEY,
  baseUrl: BASE_URL,
});

async function runTestSuite() {
  let passed = 0;
  let failed = 0;

  async function testStep(name: string, fn: () => Promise<unknown>) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      const res = await fn();
      console.log(`✅ OK`);
      if (res !== undefined && res !== null) {
        if (Array.isArray(res)) {
          console.log(`   ↳ Returned ${res.length} item(s)`);
        } else if (typeof res === "object") {
          console.log(`   ↳ Payload:`, JSON.stringify(res).slice(0, 120) + "...");
        }
      }
      passed++;
    } catch (err: any) {
      console.log(`❌ FAILED`);
      console.error(`   ↳ Error: ${err.message || err}`);
      if (err.statusCode) console.error(`   ↳ Status Code: ${err.statusCode}`);
      failed++;
    }
  }

  // 1. Stats Module
  await testStep("StatsModule: getGlobal()", async () => {
    return await client.stats.getGlobal();
  });

  // 2. Search Module
  await testStep("SearchModule: query('naruto')", async () => {
    return await client.search.query("naruto");
  });

  // 3. Vault Module
  await testStep("VaultModule: getCategories()", async () => {
    return await client.vault.getCategories();
  });

  await testStep("VaultModule: list({ limit: 5 })", async () => {
    return await client.vault.list({ limit: 5 });
  });

  await testStep("VaultModule: search('overlay')", async () => {
    return await client.vault.search("overlay");
  });

  // 4. Raw Clips Module
  await testStep("RawClipsModule: listCollections()", async () => {
    return await client.rawClips.listCollections();
  });

  // 5. Showcase: Projects, Edits
  await testStep("ProjectsModule: list({ limit: 5 })", async () => {
    return await client.projects.list({ limit: 5 });
  });

  await testStep("EditsModule: list({ limit: 5 })", async () => {
    return await client.edits.list({ limit: 5 });
  });

  // 6. Audio Stream Helper
  await testStep("RawClipsModule: getStreamUrl('sample.mp4')", async () => {
    return client.rawClips.getStreamUrl("sample.mp4");
  });

  console.log(`\n======================================================`);
  console.log(`🏁 Live Test Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);
}

runTestSuite().catch((err) => {
  console.error("Unhandled test suite failure:", err);
  process.exit(1);
});
