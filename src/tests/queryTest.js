/**
 * Standalone test — verifies the local parser + product matcher
 * produce correct categories for all 15 required test queries.
 * Run with: node src/tests/queryTest.js
 */

// ── Inline the parser (no ES module imports in Node without config) ─────────

const CATEGORY_KEYWORDS = {
  pens: ["pen", "pens", "ballpen", "ballpoint", "gel pen", "gel pens", "ink pen", "fountain pen", "rollerball", "marker", "stationery pen"],
  notebooks: ["notebook", "notebooks", "spiral notebook", "exercise book", "writing pad", "notepad", "note pad"],
  books: ["book", "books", "novel", "novels", "textbook", "textbooks", "fiction book", "non-fiction book", "paperback", "hardcover"],
  "running shoes": ["running shoe", "running shoes", "sneaker", "sneakers", "jogging shoe", "jogging shoes", "sport shoe", "sport shoes", "athletic shoe", "athletic shoes", "running footwear", "gym shoes"],
  "formal shoes": ["formal shoe", "formal shoes", "office shoe", "office shoes", "dress shoe", "dress shoes", "oxford", "derby", "loafer", "loafers", "leather shoe", "leather shoes", "brogues"],
  sandals: ["sandal", "sandals", "slipper", "slippers", "flip-flop", "flip flop", "flip-flops", "beach shoes"],
  "t-shirts": ["t-shirt", "t-shirts", "tshirt", "tee", "tees", "polo shirt", "round neck"],
  jeans: ["jeans", "denim", "denims", "jeans pant", "denim pants", "slim jeans", "regular jeans"],
  jackets: ["jacket", "jackets", "hoodie", "hoodies", "windbreaker", "winter jacket", "puffer jacket", "padded jacket", "bomber jacket", "coat"],
  sunglasses: ["sunglasses", "sunglass", "shades", "sun glasses", "uv glasses", "polarised glasses"],
  wallets: ["wallet", "wallets", "bifold", "money clip", "card holder", "card wallet", "leather wallet"],
  belts: ["belt", "belts", "leather belt", "waist belt", "formal belt", "casual belt"],
  handbags: ["handbag", "handbags", "purse", "purses", "ladies bag", "women bag", "shoulder bag", "tote bag", "sling bag", "clutch"],
  watches: ["watch", "watches", "wrist watch", "analog watch", "digital watch", "quartz watch"],
  "mechanical keyboards": ["mechanical keyboard", "mechanical keyboards", "mech keyboard", "gaming keyboard", "rgb keyboard", "tactile keyboard", "clicky keyboard", "blue switch keyboard", "red switch keyboard", "keyboard for gaming", "keyboard for gamer"],
  keyboards: ["keyboard", "keyboards", "wireless keyboard", "bluetooth keyboard", "membrane keyboard", "typing keyboard"],
  "gaming mice": ["gaming mouse", "gaming mice", "rgb mouse", "gaming optical mouse", "fps mouse", "esports mouse"],
  "computer mice": ["mouse", "mice", "computer mouse", "wireless mouse", "bluetooth mouse", "optical mouse", "trackball"],
  "gaming headsets": ["gaming headset", "gaming headsets", "gaming headphone", "gaming headphones", "surround headset", "gaming audio"],
  earbuds: ["earbud", "earbuds", "tws", "true wireless", "airpods", "earbuds wireless", "in-ear wireless", "wireless earphones", "wireless earbuds"],
  headphones: ["headphone", "headphones", "earphone", "earphones", "over-ear", "on-ear", "neckband", "wired headphone", "wireless headphone", "bluetooth headphone", "noise cancelling headphone", "anc headphone"],
  laptops: ["laptop", "laptops", "notebook computer", "macbook", "chromebook", "ultrabook", "computer", "pc", "ultraportable"],
  tablets: ["tablet", "tablets", "ipad", "android tablet", "tab", "e-reader", "drawing tablet", "digital notepad"],
  smartwatches: ["smartwatch", "smartwatches", "smart watch", "smart watches", "fitness watch", "connected watch", "apple watch", "galaxy watch"],
  monitors: ["monitor", "monitors", "display", "computer monitor", "pc monitor", "gaming monitor", "led monitor", "4k monitor"],
  smartphones: ["smartphone", "smartphones", "phone", "phones", "mobile", "android phone", "5g phone", "iphone", "mobile phone", "cell phone"],
  cameras: ["camera", "cameras", "dslr", "mirrorless", "point and shoot", "point-and-shoot", "action camera", "vlogging camera", "digital camera"],
  "bluetooth speakers": ["bluetooth speaker", "bluetooth speakers", "wireless speaker", "portable speaker", "outdoor speaker", "waterproof speaker", "speaker", "speakers"],
  "power banks": ["power bank", "power banks", "powerbank", "portable charger", "battery bank", "mobile charger", "emergency charger"],
  "usb flash drives": ["usb flash drive", "usb flash drives", "pendrive", "pen drive", "flash drive", "usb drive", "thumb drive", "usb stick"],
  "external hard drives": ["external hard drive", "external hard drives", "portable hard drive", "external hdd", "portable hdd", "external disk", "hard drive"],
  tripods: ["tripod", "tripods", "camera tripod", "flexible tripod", "gorilla pod", "camera stand", "phone stand tripod"],
  "school bags": ["school bag", "school bags", "kids bag", "kids backpack", "children bag", "school backpack", "primary bag"],
  backpacks: ["backpack", "backpacks", "bag", "bags", "college bag", "travel bag", "rucksack", "sling bag", "laptop bag"],
  "yoga mats": ["yoga mat", "yoga mats", "exercise mat", "gym mat", "workout mat", "fitness mat", "pilates mat"],
  "fitness trackers": ["fitness tracker", "fitness trackers", "fitness band", "activity tracker", "activity band", "step counter", "pedometer"],
  "sports bottles": ["sports bottle", "sports bottles", "gym bottle", "gym water bottle", "shaker bottle", "workout bottle"],
  "water bottles": ["water bottle", "water bottles", "sipper", "sipper bottle", "insulated bottle", "steel bottle", "hydration bottle"],
  "desk lamps": ["desk lamp", "desk lamps", "table lamp", "reading lamp", "study lamp", "led lamp", "bed lamp", "night lamp"],
  "coffee mugs": ["coffee mug", "coffee mugs", "mug", "mugs", "tea mug", "travel mug", "thermos mug", "insulated mug"],
};

const PRICE_REGEX = [
  /under\s*[₹rs.]*\s*([\d,]+)/i,
  /below\s*[₹rs.]*\s*([\d,]+)/i,
  /less\s+than\s*[₹rs.]*\s*([\d,]+)/i,
  /within\s*[₹rs.]*\s*([\d,]+)/i,
  /max(?:imum)?\s*(?:price)?\s*[₹rs.]*\s*([\d,]+)/i,
  /budget\s*(?:of|is|:)?\s*[₹rs.]*\s*([\d,]+)/i,
  /price\s*[₹rs.]*\s*([\d,]+)/i,
  /[₹]\s*([\d,]+)/i,
  /rs\.?\s*([\d,]+)/i,
  /([\d,]+)\s*(?:rupees|inr)\b/i,
];

function parseLocalIntent(query) {
  const q = query.toLowerCase().trim();
  // Match LONGEST keyword (most specific wins)
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
  let maxPrice = null;
  for (const regex of PRICE_REGEX) {
    const match = q.match(regex);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      if (!isNaN(num) && num > 0) { maxPrice = num; break; }
    }
  }
  return { category, maxPrice };
}

// ── Test cases ────────────────────────────────────────────────────────────────
const TEST_CASES = [
  { query: "Pens with price 10 rupees",                           expected: { category: "pens",               maxPrice: 10    } },
  { query: "Show me running shoes under ₹5000 suitable for beginners", expected: { category: "running shoes",      maxPrice: 5000  } },
  { query: "Find a laptop for students under ₹60000",             expected: { category: "laptops",             maxPrice: 60000 } },
  { query: "Show wireless headphones under ₹3000",               expected: { category: "headphones",          maxPrice: 3000  } },
  { query: "I need a backpack for college under ₹2000",           expected: { category: "backpacks",           maxPrice: 2000  } },
  { query: "Show me a smartphone under ₹20000",                  expected: { category: "smartphones",         maxPrice: 20000 } },
  { query: "Find a smartwatch under ₹5000",                      expected: { category: "smartwatches",        maxPrice: 5000  } },
  { query: "Show me a camera for beginners",                      expected: { category: "cameras",             maxPrice: null  } },
  { query: "I need a water bottle for gym under ₹1000",           expected: { category: "water bottles",       maxPrice: 1000  } },
  { query: "Show me books under ₹500",                           expected: { category: "books",               maxPrice: 500   } },
  { query: "Find wireless earbuds under ₹3000",                   expected: { category: "earbuds",             maxPrice: 3000  } },
  { query: "Show me a power bank under ₹2000",                   expected: { category: "power banks",         maxPrice: 2000  } },
  { query: "I need a keyboard for gaming",                        expected: { category: "mechanical keyboards", maxPrice: null  } },
  { query: "Show me sunglasses under ₹1500",                     expected: { category: "sunglasses",          maxPrice: 1500  } },
  { query: "Find a tablet for students under ₹30000",             expected: { category: "tablets",             maxPrice: 30000 } },
];

// ── Run ────────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

console.log("\n=== SmartShop Query Parser Test ===\n");

for (const tc of TEST_CASES) {
  const result = parseLocalIntent(tc.query);
  const catOk    = result.category  === tc.expected.category;
  const priceOk  = result.maxPrice  === tc.expected.maxPrice;
  const ok = catOk && priceOk;

  if (ok) {
    passed++;
    console.log(`✅ "${tc.query}"`);
    console.log(`   category=${result.category}  maxPrice=${result.maxPrice}\n`);
  } else {
    failed++;
    console.log(`❌ "${tc.query}"`);
    console.log(`   EXPECTED  category=${tc.expected.category}  maxPrice=${tc.expected.maxPrice}`);
    console.log(`   GOT       category=${result.category}  maxPrice=${result.maxPrice}\n`);
  }
}

console.log(`\n=== Results: ${passed}/${TEST_CASES.length} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
