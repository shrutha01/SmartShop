/**
 * localParser.js — Intent Parser
 * Extracts structured search intent from natural-language queries.
 * Used as the primary (or fallback) parser when Gemini API is unavailable.
 */

// ── Category keyword map ────────────────────────────────────────────────────
// Keys are CANONICAL category names (must match product.category exactly).
// Values are arrays of query terms that map to that category.
// More specific entries must come BEFORE generic ones to avoid mis-matching.
const CATEGORY_KEYWORDS = {
  // Stationery & writing
  pens: [
    "pen", "pens", "ballpen", "ballpoint", "gel pen", "gel pens", "ink pen",
    "fountain pen", "rollerball", "marker", "stationery pen",
  ],
  notebooks: [
    "notebook", "notebooks", "spiral notebook", "exercise book",
    "writing pad", "notepad", "note pad",
  ],
  books: [
    "book", "books", "novel", "novels", "textbook", "textbooks",
    "fiction book", "non-fiction book", "paperback", "hardcover",
  ],

  // Footwear — specific first, then generic
  "running shoes": [
    "running shoe", "running shoes", "sneaker", "sneakers", "jogging shoe",
    "jogging shoes", "sport shoe", "sport shoes", "athletic shoe", "athletic shoes",
    "running footwear", "running boot", "gym shoes",
  ],
  "formal shoes": [
    "formal shoe", "formal shoes", "office shoe", "office shoes",
    "dress shoe", "dress shoes", "oxford", "derby", "loafer", "loafers",
    "leather shoe", "leather shoes", "brogues",
  ],
  sandals: [
    "sandal", "sandals", "slipper", "slippers", "flip-flop", "flip flop",
    "flip-flops", "beach shoes", "casual sandal",
  ],

  // Clothing
  "t-shirts": [
    "t-shirt", "t-shirts", "tshirt", "tee", "tees", "polo shirt",
    "round neck", "collar tee", "half sleeve shirt",
  ],
  jeans: [
    "jeans", "denim", "denims", "jeans pant", "denim pants",
    "slim jeans", "regular jeans", "stretch jeans",
  ],
  jackets: [
    "jacket", "jackets", "hoodie", "hoodies", "windbreaker", "winter jacket",
    "puffer jacket", "padded jacket", "bomber jacket", "coat", "overcoat",
  ],

  // Accessories
  sunglasses: [
    "sunglasses", "sunglass", "shades", "sun glasses", "uv glasses",
    "polarised glasses", "tinted glasses",
  ],
  wallets: [
    "wallet", "wallets", "bifold", "money clip", "card holder",
    "card wallet", "leather wallet",
  ],
  belts: [
    "belt", "belts", "leather belt", "waist belt", "formal belt", "casual belt",
  ],
  handbags: [
    "handbag", "handbags", "purse", "purses", "ladies bag", "women bag",
    "shoulder bag", "tote bag", "sling bag", "clutch",
  ],
  smartwatches: [
    "smartwatch", "smartwatches", "smart watch", "smart watches",
    "fitness watch", "connected watch", "apple watch", "galaxy watch",
  ],
  watches: [
    "watch", "watches", "wrist watch", "analog watch", "digital watch",
    "quartz watch", "mens watch", "ladies watch",
  ],

  // Tech — most specific first
  "mechanical keyboards": [
    "mechanical keyboard", "mechanical keyboards", "mech keyboard",
    "gaming keyboard", "rgb keyboard", "tactile keyboard", "clicky keyboard",
    "blue switch keyboard", "red switch keyboard",
    "keyboard for gaming", "keyboard for gamer",
  ],
  keyboards: [
    "keyboard", "keyboards", "wireless keyboard", "bluetooth keyboard",
    "membrane keyboard", "typing keyboard",
  ],
  "gaming mice": [
    "gaming mouse", "gaming mice", "rgb mouse", "gaming optical mouse",
    "fps mouse", "esports mouse",
  ],
  "computer mice": [
    "mouse", "mice", "computer mouse", "wireless mouse", "bluetooth mouse",
    "optical mouse", "trackball",
  ],
  "gaming headsets": [
    "gaming headset", "gaming headsets", "gaming headphone", "gaming headphones",
    "surround headset", "gaming audio",
  ],
  earbuds: [
    "earbud", "earbuds", "tws", "true wireless", "airpods", "earbuds wireless",
    "in-ear wireless", "wireless earphones", "wireless earbuds",
  ],
  headphones: [
    "headphone", "headphones", "earphone", "earphones", "over-ear", "on-ear",
    "neckband", "wired headphone", "wireless headphone", "bluetooth headphone",
    "noise cancelling headphone", "anc headphone",
  ],
  laptops: [
    "laptop", "laptops", "notebook computer", "macbook", "chromebook",
    "ultrabook", "computer", "pc", "ultraportable",
  ],
  tablets: [
    "tablet", "tablets", "ipad", "android tablet", "tab", "e-reader",
    "drawing tablet", "digital notepad",
  ],
  smartwatches: [
    "smartwatch", "smartwatches", "smart watch", "smart watches",
    "fitness watch", "connected watch", "apple watch", "galaxy watch",
  ],
  monitors: [
    "monitor", "monitors", "display", "computer monitor", "pc monitor",
    "gaming monitor", "led monitor", "4k monitor",
  ],
  smartphones: [
    "smartphone", "smartphones", "phone", "phones", "mobile", "android phone",
    "5g phone", "iphone", "mobile phone", "cell phone",
  ],
  cameras: [
    "camera", "cameras", "dslr", "mirrorless", "point and shoot",
    "point-and-shoot", "action camera", "vlogging camera", "digital camera",
  ],

  // Accessories / peripherals
  "bluetooth speakers": [
    "bluetooth speaker", "bluetooth speakers", "wireless speaker", "portable speaker",
    "outdoor speaker", "waterproof speaker", "speaker", "speakers",
  ],
  "power banks": [
    "power bank", "power banks", "powerbank", "portable charger",
    "battery bank", "mobile charger", "emergency charger",
  ],
  "usb flash drives": [
    "usb flash drive", "usb flash drives", "pendrive", "pen drive",
    "flash drive", "usb drive", "thumb drive", "usb stick",
  ],
  "external hard drives": [
    "external hard drive", "external hard drives", "portable hard drive",
    "external hdd", "portable hdd", "external disk", "hard drive",
  ],
  tripods: [
    "tripod", "tripods", "camera tripod", "flexible tripod", "gorilla pod",
    "camera stand", "phone stand tripod",
  ],

  // Bags
  "school bags": [
    "school bag", "school bags", "kids bag", "kids backpack",
    "children bag", "school backpack", "primary bag",
  ],
  backpacks: [
    "backpack", "backpacks", "bag", "bags", "college bag", "travel bag",
    "rucksack", "sling bag", "laptop bag",
  ],

  // Fitness
  "yoga mats": [
    "yoga mat", "yoga mats", "exercise mat", "gym mat", "workout mat",
    "fitness mat", "pilates mat",
  ],
  "fitness trackers": [
    "fitness tracker", "fitness trackers", "fitness band", "activity tracker",
    "activity band", "step counter", "pedometer",
  ],

  // Bottles
  "sports bottles": [
    "sports bottle", "sports bottles", "gym bottle", "gym water bottle",
    "shaker bottle", "workout bottle",
  ],
  "water bottles": [
    "water bottle", "water bottles", "sipper", "sipper bottle",
    "insulated bottle", "steel bottle", "hydration bottle",
  ],

  // Home / office
  "desk lamps": [
    "desk lamp", "desk lamps", "table lamp", "reading lamp", "study lamp",
    "led lamp", "bed lamp", "night lamp",
  ],
  "coffee mugs": [
    "coffee mug", "coffee mugs", "mug", "mugs", "tea mug", "travel mug",
    "thermos mug", "insulated mug",
  ],
};

// ── Brand keywords ──────────────────────────────────────────────────────────
const BRAND_KEYWORDS = [
  "adidas", "nike", "puma", "asics", "reebok", "woodland", "bata",
  "lenovo", "hp", "asus", "acer", "dell", "apple", "microsoft", "samsung",
  "sony", "jbl", "boat", "zebronics", "bose", "sennheiser", "logitech",
  "razer", "hyperx", "corsair", "redgear", "cosmic byte",
  "redmi", "xiaomi", "mi", "oneplus", "realme", "oppo", "vivo", "poco",
  "skybags", "american tourister", "f gear", "safari", "wildcraft",
  "fastrack", "titan", "casio", "fossil", "noise", "fire-boltt", "amazfit",
  "garmin", "canon", "nikon", "fujifilm", "godox", "joby", "manfrotto",
  "seagate", "western digital", "wd", "toshiba", "kingston", "sandisk",
  "anker", "ambrane", "mi powerbank", "parker", "reynolds", "cello",
  "classmate", "navneet", "peter england", "us polo", "tommy hilfiger",
  "levis", "wrangler", "flying machine", "lee cooper", "red tape",
  "baggit", "caprese", "lavie", "united colors of benetton", "ucb",
  "wildcraft", "nivia", "boldfit", "strauss", "nalgene", "milton", "borosil",
  "wipro", "syska", "philips", "signoraware",
];

// ── Price extraction patterns ───────────────────────────────────────────────
const PRICE_REGEX = [
  /under\s*[₹rs.]*\s*([\d,]+)/i,
  /below\s*[₹rs.]*\s*([\d,]+)/i,
  /less\s+than\s*[₹rs.]*\s*([\d,]+)/i,
  /within\s*[₹rs.]*\s*([\d,]+)/i,
  /max(?:imum)?\s*(?:price)?\s*[₹rs.]*\s*([\d,]+)/i,
  /budget\s*(?:of|is|:)?\s*[₹rs.]*\s*([\d,]+)/i,
  /price\s*[₹rs.]*\s*([\d,]+)/i,            // "price 10", "price ₹10"
  /[₹]\s*([\d,]+)/i,                         // "₹10"
  /rs\.?\s*([\d,]+)/i,                       // "Rs 10", "Rs.10"
  /([\d,]+)\s*(?:rupees|inr)\b/i,            // "10 rupees", "10 INR", "5000 rupees"
];

// ── Use-case keywords ───────────────────────────────────────────────────────
const USE_CASE_KEYWORDS = {
  beginner: ["beginner", "beginners", "starter", "newbie", "starting", "first time"],
  student: ["student", "students", "college", "school", "university", "campus"],
  professional: ["professional", "office", "work", "business", "corporate"],
  gaming: ["gaming", "gamer", "game", "games", "play", "esports", "fps"],
  travel: ["travel", "travelling", "commute", "trip", "outdoor", "adventure"],
  gym: ["gym", "fitness", "workout", "exercise", "training", "cardio"],
};

// ── Feature keywords ────────────────────────────────────────────────────────
const FEATURE_KEYWORDS = {
  wireless: ["wireless", "bluetooth", "cordless"],
  lightweight: ["lightweight", "light", "thin", "slim", "compact", "portable"],
  waterproof: ["waterproof", "water resistant", "water-proof", "rain"],
  budget: ["budget", "affordable", "cheap", "economical", "value", "inexpensive"],
  premium: ["premium", "high-end", "luxury", "best", "top"],
  noiseCancel: ["noise cancelling", "anc", "noise cancellation", "noise-cancelling"],
  longBattery: ["long battery", "battery life", "extended battery"],
  camera: ["camera", "photography", "photo", "selfie"],
  fast_charging: ["fast charge", "quick charge", "rapid charge", "turbo charge"],
};

// ── Words NOT useful as search tokens ──────────────────────────────────────
const STOP_WORDS = new Set([
  "show", "me", "find", "get", "want", "need", "looking", "for", "a", "an",
  "the", "and", "or", "under", "below", "above", "with", "without", "good",
  "best", "some", "that", "which", "is", "are", "in", "of", "to", "very",
  "suitable", "perfect", "ideal", "nice", "please", "can", "you",
  // Price-related words — must NOT be used as product search tokens
  "price", "rupees", "rupee", "inr", "rs", "cost", "costs", "worth",
  "budget", "money", "pay", "paying", "spend", "spending",
]);

/**
 * Parse a natural-language query and return structured intent.
 */
export function parseLocalIntent(query) {
  const q = query.toLowerCase().trim();

  // ── 1. Category detection ──────────────────────────────────────────────
  // Match the LONGEST keyword found anywhere in the query.
  // Longer keyword = more specific = wins over shorter substring.
  // e.g. "smartwatch" (10 chars) beats "watch" (5 chars).
  let category = null;
  let bestMatchLen = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (kw.length > bestMatchLen && q.includes(kw)) {
        bestMatchLen = kw.length;
        category = cat;
      }
    }
  }

  // ── 2. Max price detection ─────────────────────────────────────────────
  let maxPrice = null;
  for (const regex of PRICE_REGEX) {
    const match = q.match(regex);
    if (match) {
      const raw = match[1].replace(/,/g, "");
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num > 0) {
        maxPrice = num;
        break;
      }
    }
  }

  // ── 3. Brand detection ─────────────────────────────────────────────────
  let brand = null;
  for (const b of BRAND_KEYWORDS) {
    if (q.includes(b)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  // ── 4. Use-case detection ──────────────────────────────────────────────
  const useCases = [];
  for (const [uc, keywords] of Object.entries(USE_CASE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      useCases.push(uc);
    }
  }
  const useCase = useCases.join(", ") || null;

  // ── 5. Feature detection ───────────────────────────────────────────────
  const features = [];
  for (const [feat, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      features.push(feat);
    }
  }

  // ── 6. Keyword extraction (for secondary matching) ────────────────────
  const words = q
    .replace(/[₹.,!?]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  return {
    category,
    maxPrice,
    minPrice: null,
    brand,
    useCase,
    features,
    keywords: [...new Set(words)],
    raw: query,
  };
}
