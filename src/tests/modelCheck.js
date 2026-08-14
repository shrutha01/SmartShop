/**
 * modelCheck.js — Read-only: tests which Gemini flash models work with the configured API key.
 * Does NOT print the API key. Run with: node src/tests/modelCheck.js
 */

const fs = require("fs");
const path = require("path");

// Load .env without printing key
const envPath = path.join(__dirname, "../../.env");
const env = fs.readFileSync(envPath, "utf8");
const keyLine = env.split("\n").find((l) => l.startsWith("GEMINI_API_KEY="));
const key = keyLine ? keyLine.split("=").slice(1).join("=").trim() : "";

if (!key) {
  console.error("ERROR: GEMINI_API_KEY not set in .env");
  process.exit(1);
}

console.log("Key loaded: " + key.slice(0, 8) + "... (not printing full key)\n");

// Candidates ordered by preference for SmartShop (fast, cheap, JSON)
const CANDIDATES = [
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

async function testModel(model) {
  const url = `${BASE_URL}${model}:generateContent?key=${key}`;
  const body = JSON.stringify({
    contents: [{ parts: [{ text: 'Reply ONLY with valid JSON: {"ok":true}' }] }],
    generationConfig: { temperature: 0, maxOutputTokens: 30 },
  });

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const d = await r.json();

    if (!r.ok) {
      return {
        model,
        ok: false,
        status: r.status,
        msg: (d?.error?.message || "").slice(0, 100),
      };
    }

    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { model, ok: true, status: r.status, response: text.trim().slice(0, 60) };
  } catch (e) {
    return { model, ok: false, status: 0, msg: e.message.slice(0, 80) };
  }
}

(async () => {
  console.log("=== SmartShop: Live Gemini Model Availability Test ===\n");
  console.log("Testing candidates...\n");

  let firstWorking = null;

  for (const model of CANDIDATES) {
    const result = await testModel(model);
    const icon = result.ok ? "✅" : "❌";

    if (result.ok) {
      console.log(`${icon} ${result.model}`);
      console.log(`   HTTP ${result.status} | Response: ${result.response}`);
      if (!firstWorking) firstWorking = model;
    } else {
      console.log(`${icon} ${result.model}`);
      console.log(`   HTTP ${result.status} | ${result.msg}`);
    }
    console.log();
  }

  console.log("=== Recommendation ===\n");
  if (firstWorking) {
    console.log(`Best model for SmartShop: ${firstWorking}`);
    console.log(`\nSet in aiService.js:`);
    console.log(`  const GEMINI_MODEL = "${firstWorking}";`);
  } else {
    console.log("No working model found. Check your API key and account tier.");
  }
})();
