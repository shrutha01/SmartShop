# SmartShop AI 🛍️

> **Conversational Product Search for eCommerce** — Technical Assessment (Option 3)

A polished React Native (Expo) mobile application that lets users find products using plain English queries, powered by **Gemini AI** with a robust local fallback parser.

---

## 📱 Problem Statement

Traditional keyword search in eCommerce is rigid and unforgiving. Users must know the exact product name or category.  
**SmartShop AI** solves this by letting users describe what they want in natural language — the AI understands their intent, extracts structured search parameters, and returns the most relevant products with an explanation of why each one matches.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗣️ Natural Language Search | Type queries like "running shoes for beginners under ₹5000" |
| 🧠 AI Intent Extraction | Extracts category, price, brand, use-case, and features |
| 🎯 Smart Product Matching | Weighted scoring across 6 criteria |
| 📋 Match Explanation | Each product explains why it matches your query |
| 🔄 Local Fallback | Works without an API key using built-in parser |
| 🕐 Search History | Recent searches saved via AsyncStorage |
| 📊 Sort & Filter | Sort results by relevance, price (low/high), or rating |
| 🌙 Dark Theme | Polished dark UI with purple accent |

---

## 🤖 How the AI Works

```
User Query
    │
    ▼
┌─────────────────────────────┐
│   Gemini 1.5 Flash API      │  ◄── (if API key is present)
│   extracts structured JSON: │
│   { category, maxPrice,     │
│     brand, useCase,         │
│     features, keywords }    │
└──────────┬──────────────────┘
           │  (on failure / no key)
           ▼
┌─────────────────────────────┐
│  Local Intent Parser        │  ◄── always available fallback
│  (regex + keyword matching) │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Product Matching Algorithm │
│  ─────────────────────────  │
│  Category match  → 40 pts   │
│  Price in budget → 30 pts   │
│  Use-case match  → 20 pts   │
│  Feature/keyword → 15 pts   │
│  Brand match     → 10 pts   │
│  Rating bonus    →  5 pts   │
└──────────┬──────────────────┘
           │
           ▼
    Sorted Results + Explanation
```

> The AI **never invents products**. It only understands the query. All products come from a local JSON dataset.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 57) |
| Navigation | React Navigation v6 (Native Stack) |
| AI | Google Gemini 1.5 Flash API |
| Storage | AsyncStorage (recent searches) |
| UI Extras | expo-linear-gradient, expo-constants |
| Language | JavaScript (ES2020) |
| Target | Android (primary), iOS, Web |

---

## 📁 Project Structure

```
SmartShopAI/
├── App.js                          # Root: Navigation + providers
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── .env.example                    # API key template
├── .gitignore
├── README.md
│
├── assets/                         # App icons and splash screen
│
└── src/
    ├── constants/
    │   └── theme.js                # Colors, fonts, spacing, example queries
    │
    ├── data/
    │   └── products.js             # 20 sample products across 5 categories
    │
    ├── services/
    │   └── aiService.js            # Gemini API integration + fallback
    │
    ├── utils/
    │   ├── localParser.js          # Local intent parser (no API needed)
    │   ├── productMatcher.js       # Scoring and ranking algorithm
    │   └── useRecentSearches.js    # AsyncStorage hook for search history
    │
    ├── components/
    │   ├── ProductCard.js          # Product result card with explanation
    │   ├── SearchBar.js            # Animated search input
    │   ├── QueryChip.js            # Tap-to-search suggestion chip
    │   ├── LoadingOverlay.js       # Animated AI-processing loading screen
    │   └── EmptyState.js           # No results found view
    │
    └── screens/
        ├── HomeScreen.js           # Search bar, chips, recent, how-it-works
        ├── ResultsScreen.js        # Intent summary, sorted product list
        └── ProductDetailScreen.js  # Full product detail + score bar
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **npm** v9+
- **Expo Go** app on your Android/iOS phone — [expo.dev/go](https://expo.dev/go)
- *(Optional)* Android Studio for emulator

### 1 — Clone / Download the project

```bash
# If from GitHub:
git clone https://github.com/your-username/SmartShopAI.git
cd SmartShopAI

# If from ZIP:
unzip SmartShopAI.zip
cd SmartShopAI
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — (Optional) Add Gemini API Key

The app works fully without a key using the local parser.  
To enable Gemini AI, get a free key from [aistudio.google.com](https://aistudio.google.com/app/apikey) and add it to `app.json`:

```json
"extra": {
  "geminiApiKey": "YOUR_ACTUAL_KEY_HERE"
}
```

> ⚠️ **Never commit your real API key to git.** The `.gitignore` excludes `.env` but `app.json` is tracked — only add the key locally or use a CI secret.

### 4 — Run the application

```bash
# Start Expo dev server
npx expo start

# Scan the QR code with Expo Go app on your phone
# OR press 'a' to open Android emulator
# OR press 'w' to open in web browser
```

---

## 📲 Example Queries to Demo

These queries are guaranteed to return relevant results:

```
Show me running shoes under ₹5,000 suitable for beginners
Find a laptop for students under ₹60000
Show wireless headphones under ₹3000
Find a backpack for college students under ₹2000
Budget smartphone under ₹25000
Sony headphones
Adidas running shoes
Lightweight laptop with long battery
```

---

## 📸 Screenshots



| Home Screen | Search Results | Product Detail |
|---|---|---|
| Home(<img width="180" height="377" alt="Home" src="https://github.com/user-attachments/assets/100b56fa-0fa2-4085-9de9-972a51146511" />

) | Results]<img width="180" height="377" alt="Result" src="https://github.com/user-attachments/assets/3bdb42a7-ace4-4ee1-b570-375c520f413f" />
) | Detail(<img width="180" height="377" alt="Product" src="https://github.com/user-attachments/assets/fa71d694-76cf-4dbb-bfa4-bf63162f39f1" />
) |

---

## 🏗️ Build Android APK

### Expo Go (Development — recommended for demo)

```bash
npx expo start
# Press 'a' for Android emulator or scan QR for device
```

### Production APK via EAS Build (requires Expo account)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure (first time only)
eas build:configure

# Build APK for Android
eas build -p android --profile preview
```

The APK download link will appear in the terminal after the cloud build completes.

---


## 📚 Third-Party Libraries

| Library | Version | Purpose |
|---|---|---|
| expo | ~57.0.12 | Core Expo SDK |
| react-native | 0.86.2 | Mobile framework |
| @react-navigation/native | ^6.x | App navigation |
| @react-navigation/native-stack | ^6.x | Stack navigator |
| react-native-screens | ~4.5.0 | Native screen optimization |
| react-native-safe-area-context | 5.4.0 | Safe area handling |
| expo-linear-gradient | ~14.x | Gradient backgrounds |
| expo-constants | ~17.x | Access app.json extras |
| @react-native-async-storage/async-storage | 2.1.2 | Recent search persistence |


