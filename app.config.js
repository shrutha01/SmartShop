/**
 * app.config.js — Dynamic Expo config
 *
 * Reads the Gemini API key from the LOCAL environment (never from source code).
 *
 * HOW TO CONFIGURE YOUR API KEY (choose one):
 *
 * Option A — Recommended: .env file
 *   1. Copy .env.example → .env
 *   2. Set:  GEMINI_API_KEY=AIza...your_real_key...
 *   3. Run:  npx expo start --clear
 *      Expo will load .env automatically.
 *
 * Option B — Shell environment variable (PowerShell):
 *   $env:GEMINI_API_KEY="AIza...your_real_key..."
 *   npx expo start --clear
 *
 * SECURITY:
 *   .env is listed in .gitignore — it will NEVER be committed to Git.
 *   Do NOT paste the real key into app.json, source files, or README.
 */

// Expo / Node automatically loads .env in the project root at start time.
// process.env.GEMINI_API_KEY is populated from .env or shell environment.
const geminiApiKey = process.env.GEMINI_API_KEY || "";

export default {
  expo: {
    name: "SmartShop",
    slug: "smartshopai",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0F0F1A",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.assessment.smartshopai",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0F0F1A",
      },
      package: "com.assessment.smartshopai",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      // Key injected at build/start time from environment — never hardcoded
      geminiApiKey,
    },
    plugins: [],
  },
};
