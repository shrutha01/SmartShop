# SmartShop 🛍️

> **Conversational Product Search for eCommerce** 

SmartShop is a React Native mobile shopping application that allows users to search for products using natural-language queries. It uses **Google Gemini AI** to understand the user's intent and extract details such as product category, budget, brand, and use case.

If Gemini is unavailable, SmartShop automatically uses a **local rule-based parser**, so the search functionality continues to work without an API connection.

---

## 📱 Problem Statement

Traditional eCommerce search often requires users to enter exact product names or keywords.

For example, a user may search:

> "Running shoes under ₹5000 for beginners"

Instead of requiring the user to search for the exact category, SmartShop understands the complete request and extracts:

```text
Category  → Running Shoes
Budget    → ₹5000
Use Case  → Beginners
```

The application then filters and ranks relevant products from its local product dataset.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗣️ Natural Language Search | Search for products using normal conversational language |
| 🧠 Gemini AI Intent Extraction | Understands category, budget, brand, use case, features, and keywords |
| 🎯 Smart Product Matching | Filters and ranks products based on the extracted intent |
| 📋 Match Explanation | Shows why a product matches the user's search |
| 🔄 Local Parser Fallback | Continues working when Gemini is unavailable |
| 🕐 Recent Searches | Stores recent searches locally |
| 📊 Sort & Filter | Sort results by relevance, price, and rating |
| 🌙 Dark Theme | Clean dark-themed mobile interface |
| 📦 Product Categories | Supports 40 product categories |
| 🛍️ Product Dataset | Includes 120+ products for demonstration |

---

## 🤖 How the AI Works

```text
                User Query
                    │
                    ▼
        ┌────────────────────────┐
        │      Gemini AI         │
        │ gemini-flash-lite-     │
        │ latest                 │
        └────────────┬───────────┘
                     │
                     ▼
          Structured User Intent
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Category                  Price / Budget
   Brand                     Use Case
   Features                  Keywords
        │                         │
        └────────────┬────────────┘
                     ▼
        ┌────────────────────────┐
        │   Product Matcher      │
        │  Filtering & Ranking   │
        └────────────┬───────────┘
                     ▼
        Relevant Product Results
                     │
                     ▼
           Match Explanations
```

### Fallback mechanism

If Gemini cannot be used because the API key is missing or the API request fails:

```text
User Query
    │
    ▼
Gemini API
    │
    │ unavailable / error
    ▼
Local Intent Parser
    │
    ▼
Product Matcher
    │
    ▼
Relevant Results
```

This makes the application resilient and allows the core search functionality to continue working without Gemini.

---

## 🧪 Example AI Intent Extraction

### Query

```text
Running shoes under ₹5000 for beginners
```

Gemini extracts structured intent similar to:

```json
{
  "category": "running shoes",
  "maxPrice": 5000,
  "useCase": "beginners"
}
```

The application then uses this structured intent to identify relevant products from the local dataset.

### Another example

```text
Pens with price 10 rupees
```

The extracted intent is:

```json
{
  "category": "pens",
  "maxPrice": 10
}
```

Only products belonging to the relevant category and satisfying the budget are considered.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | React Native |
| Development Platform | Expo SDK 54 |
| React Native Version | 0.81.5 |
| Language | JavaScript |
| AI | Google Gemini API |
| Gemini Model | `gemini-flash-lite-latest` |
| Navigation | React Navigation |
| Local Storage | AsyncStorage |
| UI | Expo Linear Gradient |
| Configuration | Expo Constants + environment variables |
| Primary Target | Android |

---

## 📁 Project Structure

```text
SmartShop/
│
├── App.js
├── app.json
├── app.config.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
│
├── assets/
│   └── App icons and splash screen assets
│
└── src/
    │
    ├── components/
    │   ├── EmptyState.js
    │   ├── LoadingOverlay.js
    │   ├── ProductCard.js
    │   ├── QueryChip.js
    │   └── SearchBar.js
    │
    ├── constants/
    │   └── theme.js
    │
    ├── data/
    │   └── products.js
    │
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── ProductDetailScreen.js
    │   └── ResultsScreen.js
    │
    ├── services/
    │   └── aiService.js
    │
    ├── tests/
    │   ├── geminiTest.js
    │   ├── modelCheck.js
    │   └── queryTest.js
    │
    └── utils/
        ├── localParser.js
        ├── productMatcher.js
        └── useRecentSearches.js
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18 or later
- npm
- Expo Go on an Android/iOS device
- Internet connection for Gemini AI features

---

### 1. Clone the Repository

```bash
git clone https://github.com/shrutha01/SmartShop.git
cd SmartShop
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Gemini API

SmartShop can work without a Gemini API key using its built-in local parser.

To enable Gemini AI:

1. Create a Gemini API key from:

   https://aistudio.google.com/app/apikey

2. Create a `.env` file in the project root.

3. Add:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

4. Restart Expo:

```bash
npx expo start --clear
```

### 🔐 API Key Security

The real API key should **never** be added to:

- `app.json`
- `app.config.js`
- `App.js`
- `README.md`
- GitHub

The `.env` file is excluded through `.gitignore`.

A safe `.env.example` file is included in the repository:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## ▶️ Running the Application

Start the Expo development server:

```bash
npx expo start
```

Then:

- Scan the QR code using **Expo Go** on an Android device
- Or press `a` to open an Android emulator
- Or press `w` to run the web version

For a clean restart after changing environment variables:

```bash
npx expo start --clear
```

---

## 🧪 Testing Gemini Integration

The project includes a Gemini integration test.

From the project directory, run:

```bash
node src/tests/geminiTest.js
```

The test verifies that Gemini can process natural-language queries and return structured intent.

Example queries tested include:

```text
Running shoes under ₹5000 for beginners
Pens with price 10 rupees
```

---

## 📲 Example Queries

Try natural-language queries such as:

```text
Running shoes under ₹5000 for beginners
```

```text
Pens with price 10 rupees
```

```text
Find a backpack for college students under ₹2000
```

```text
Budget smartphone under ₹25000
```

```text
Sony headphones
```

```text
Adidas running shoes
```

```text
Lightweight laptop with long battery
```

```text
Show wireless headphones under ₹3000
```

The application extracts the relevant intent and uses it to find suitable products.

---

## 🔄 Gemini + Local Fallback

SmartShop uses Gemini as the primary intent extraction system.

```text
                  Search Query
                       │
                       ▼
                 Gemini API
                       │
              ┌────────┴────────┐
              │                 │
           Success             Error
              │                 │
              ▼                 ▼
       Gemini Intent      Local Parser
              │                 │
              └────────┬────────┘
                       ▼
                Product Matcher
                       │
                       ▼
                Search Results
```

This means the application remains usable even when:

- The Gemini API is unavailable
- The API request fails
- The API key is not configured
- There is a temporary network problem

---

## 🛍️ Product Matching

The product matching system uses the structured intent extracted from the user's query.

Relevant factors include:

- Product category
- Price/budget
- Brand
- Use case
- Features
- Keywords
- Product rating

The application first identifies suitable products and then ranks them based on relevance.

Each result also provides an explanation showing why the product matches the user's search.

> **Important:** Gemini is used to understand the user's query. Products are selected from the application's local product dataset rather than being invented by the AI.

---

## 📸 Screenshots

### Home Screen, Search Results & Product Detail

| Home Screen | Search Results | Product Detail |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/100b56fa-0fa2-4085-9de9-972a51146511" alt="Home Screen" width="180"> | <img src="https://github.com/user-attachments/assets/3bdb42a7-ace4-4ee1-b570-375c520f413f" alt="Search Results" width="180"> | <img src="https://github.com/user-attachments/assets/fa71d694-76cf-4dbb-bfa4-bf63162f39f1" alt="Product Detail" width="180"> |

---

## 🔒 Security

The project follows basic API-key security practices:

- Real Gemini API key is stored locally in `.env`
- `.env` is excluded from Git
- `.env.example` contains only a placeholder
- No API key is hardcoded into the application source
- No API key is included in `app.json`
- No API key is included in the README

**Never commit your `.env` file to GitHub.**

---

## 📦 Repository

GitHub:

**https://github.com/shrutha01/SmartShop**

---

## 🎯 Assessment Highlights

SmartShop demonstrates:

- Natural-language product search
- AI-based intent extraction
- Structured JSON intent
- Product category filtering
- Budget-aware search
- Use-case understanding
- Product relevance ranking
- Recommendation explanations
- Local fallback processing
- Search history
- Mobile UI development using React Native and Expo
- Secure local API-key configuration

---

## 👩‍💻 Project

**SmartShop**

AI-powered conversational product search mobile application developed as part of a technical assessment.

---
