/**
 * geminiTest.js — Standalone Gemini API integration test
 *
 * Usage (PowerShell):
 *   $env:GEMINI_API_KEY="AIza...your_key..."
 *   node src/tests/geminiTest.js
 *
 * OR if you have a .env file:
 *   node -e "require('fs').existsSync('.env') && require('fs').readFileSync('.env','utf8').split('\n').forEach(l=>{const[k,...v]=l.split('=');k&&!k.startsWith('#')&&(process.env[k.trim()]=v.join('=').trim())})" && node src/tests/geminiTest.js
 *
 * Tests:
 *   1. "Running shoes under ₹5000 for beginners"  → category: running shoes, maxPrice: 5000
 *   2. "Pens with price 10 rupees"                → category: pens, maxPrice: 10
 */

// ── Load .env manually (no dotenv dependency needed) ──────────────────────────
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
  console.log("✓ Loaded .env file\n");
} else {
  console.log("ℹ No .env file found — using shell environment variables\n");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL   = "gemini-flash-lite-latest"; // verified working for new accounts
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ── Test cases ─────────────────────────────────────────────────────────────────
const TEST_CASES = [
  {
    query:    "Running shoes under ₹5000 for beginners",
    expected: { category: "running shoes", maxPrice: 5000 },
  },
  {
    query:    "Pens with price 10 rupees",
    expected: { category: "pens", maxPrice: 10 },
  },
];

const SYSTEM_PROMPT = `You are a product search intent extractor for an eCommerce app called SmartShop.

Given a user's natural-language search query, extract and return ONLY a valid JSON object with these fields:

{
  "category": "<one of the categories below or null>",
  "maxPrice": <number in INR or null>,
  "minPrice": <number in INR or null>,
  "brand": "<brand name or null>",
  "useCase": "<short description of intended user or use case or null>",
  "features": ["<feature1>", "<feature2>"],
  "keywords": ["<keyword1>", "<keyword2>"]
}

Valid categories (use exact spelling):
pens | running shoes | laptops | headphones | smartphones | backpacks |
watches | water bottles | t-shirts | jeans | jackets | formal shoes |
sandals | sunglasses | wallets | belts | handbags | smartwatches | tablets |
keyboards | computer mice | monitors | power banks | bluetooth speakers |
earbuds | cameras | tripods | books | notebooks | school bags | desk lamps |
coffee mugs | fitness trackers | yoga mats | sports bottles | gaming headsets |
gaming mice | mechanical keyboards | usb flash drives | external hard drives

Rules:
- Return ONLY the JSON object. No markdown, no explanation, no extra text.
- "category" must be exactly one of the listed options or null.
- Prices must be plain numbers (no currency symbols, no commas).
- If the user mentions "under ₹5000" set maxPrice to 5000.
- If not mentioned, set the field to null or empty array.
- "pens with price 10 rupees" → category: "pens", maxPrice: 10
- "running shoes under ₹5000 for beginners" → category: "running shoes", maxPrice: 5000, useCase: "beginners"
`;

async function callGemini(query) {
  const body = {
    contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser query: "${query}"` }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
  };

  const response = await fetch(GEMINI_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${err.slice(0, 300)}`);
  }

  const data   = await response.json();
  const text   = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function runTests() {
  console.log(`=== Gemini Integration Test ===`);
  console.log(`Model: ${GEMINI_MODEL}`);
  console.log(`Key:   ${GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 8) + "..." : "NOT SET ❌"}\n`);

  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.error("❌ GEMINI_API_KEY is not set.");
    console.error("   Create .env with:  GEMINI_API_KEY=AIza...\n");
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    process.stdout.write(`Testing: "${tc.query}"\n`);
    try {
      const result = await callGemini(tc.query);
      console.log(`  Gemini response: ${JSON.stringify(result)}`);

      const catOk   = result.category === tc.expected.category;
      const priceOk = result.maxPrice  === tc.expected.maxPrice;

      if (catOk && priceOk) {
        console.log(`  ✅ PASS — category=${result.category}  maxPrice=${result.maxPrice}\n`);
        passed++;
      } else {
        console.log(`  ❌ FAIL`);
        if (!catOk)   console.log(`     category: expected "${tc.expected.category}", got "${result.category}"`);
        if (!priceOk) console.log(`     maxPrice: expected ${tc.expected.maxPrice}, got ${result.maxPrice}`);
        console.log();
        failed++;
      }
    } catch (err) {
      console.log(`  ❌ ERROR — ${err.message}\n`);
      failed++;
    }
  }

  console.log(`=== Results: ${passed}/${TEST_CASES.length} passed ===\n`);

  if (failed > 0) process.exit(1);
}

runTests();
