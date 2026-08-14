/**
 * aiService.js
 * Sends the user's query to the Gemini API and returns structured intent.
 * Falls back gracefully to the local parser if no API key is present or on error.
 *
 * MODEL: gemini-flash-lite-latest  (verified working Aug 2026 — new account compatible)
 *        gemini-2.5-flash / gemini-2.5-flash-lite return 404 for new API accounts.
 * KEY SOURCE: app.config.js reads GEMINI_API_KEY from .env / shell env
 */

import Constants from "expo-constants";
import { parseLocalIntent } from "../utils/localParser";

// Primary key source: injected by app.config.js from process.env.GEMINI_API_KEY
// Secondary source:   EXPO_PUBLIC_GEMINI_API_KEY (direct env variable fallback)
const GEMINI_API_KEY =
  Constants.expoConfig?.extra?.geminiApiKey ||
  (typeof process !== "undefined" ? process.env.EXPO_PUBLIC_GEMINI_API_KEY : "") ||
  "";

// Verified working model for new API accounts (Aug 2026)
// gemini-2.5-flash / gemini-2.5-flash-lite → 404 for new accounts
// gemini-flash-lite-latest → HTTP 200 confirmed ✅
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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

/**
 * Call Gemini API to extract intent from the user query.
 * Returns a structured intent object.
 */
async function callGeminiAPI(query) {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUser query: "${query}"`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 400,
    },
  };

  console.log(`[SmartShop] Calling Gemini API (${GEMINI_MODEL}) for: "${query}"`);

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  // Strip possible markdown code fences
  const cleaned = text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 100)}`);
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid response shape from Gemini");
  }

  console.log(`[SmartShop] Gemini intent:`, JSON.stringify(parsed));

  return {
    category: parsed.category || null,
    maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
    minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
    brand: parsed.brand || null,
    useCase: parsed.useCase || null,
    features: Array.isArray(parsed.features) ? parsed.features : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    raw: query,
    source: "gemini",
    model: GEMINI_MODEL,
  };
}

/**
 * Main exported function.
 * Tries Gemini first; falls back to local parser on any failure.
 */
export async function extractIntent(query) {
  if (!query || query.trim().length === 0) {
    throw new Error("Query cannot be empty");
  }

  // If no API key configured, go straight to local parser
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
    console.log("[SmartShop] No API key — using local parser");
    const intent = parseLocalIntent(query);
    return { ...intent, source: "local" };
  }

  try {
    const intent = await callGeminiAPI(query.trim());
    return intent;
  } catch (error) {
    console.warn(`[SmartShop] Gemini failed (${error.message}), using local parser fallback`);
    const intent = parseLocalIntent(query);
    return { ...intent, source: "local_fallback" };
  }
}

/** For debugging/testing — expose which model and key status are active */
export function getServiceInfo() {
  return {
    model: GEMINI_MODEL,
    keyConfigured: Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== ""),
    keyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 8) + "..." : "(none)",
  };
}
