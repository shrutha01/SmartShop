// Color palette
export const COLORS = {
  primary: "#6C63FF",       // Purple
  primaryDark: "#5A52D5",
  primaryLight: "#EAE9FF",
  secondary: "#FF6B6B",     // Coral
  accent: "#43D9AD",        // Mint green
  background: "#0F0F1A",    // Deep dark background
  surface: "#1A1A2E",       // Card background
  surfaceElevated: "#22213A",
  border: "#2E2E4A",
  text: {
    primary: "#FFFFFF",
    secondary: "#A0A0C0",
    muted: "#606080",
    inverse: "#0F0F1A",
  },
  rating: "#FFD700",        // Gold
  success: "#43D9AD",
  error: "#FF6B6B",
  warning: "#FFB347",
  gradient: {
    primary: ["#6C63FF", "#A855F7"],
    secondary: ["#FF6B6B", "#FF8E53"],
    card: ["#1A1A2E", "#22213A"],
    header: ["#0F0F1A", "#1A1A2E"],
  },
};

// Typography
export const FONTS = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    hero: 36,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radii
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

// Category chip colours — covers all 40 categories
export const CATEGORY_COLORS = {
  // Writing / stationery
  pens:               { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  notebooks:          { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  books:              { bg: "#FFB34720", border: "#FFB347", text: "#FFB347" },
  // Footwear
  "running shoes":    { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  "formal shoes":     { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  sandals:            { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  // Clothing
  "t-shirts":         { bg: "#A855F720", border: "#A855F7", text: "#A855F7" },
  jeans:              { bg: "#A855F720", border: "#A855F7", text: "#A855F7" },
  jackets:            { bg: "#A855F720", border: "#A855F7", text: "#A855F7" },
  // Accessories
  sunglasses:         { bg: "#FFD70020", border: "#FFD700", text: "#FFD700" },
  wallets:            { bg: "#FFD70020", border: "#FFD700", text: "#FFD700" },
  belts:              { bg: "#FFD70020", border: "#FFD700", text: "#FFD700" },
  handbags:           { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  watches:            { bg: "#FFD70020", border: "#FFD700", text: "#FFD700" },
  smartwatches:       { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  // Tech
  laptops:            { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  tablets:            { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  smartphones:        { bg: "#FFB34720", border: "#FFB347", text: "#FFB347" },
  headphones:         { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  earbuds:            { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  keyboards:          { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  "mechanical keyboards": { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  "computer mice":    { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  "gaming mice":      { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  "gaming headsets":  { bg: "#FF6B6B20", border: "#FF6B6B", text: "#FF6B6B" },
  monitors:           { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  cameras:            { bg: "#FFB34720", border: "#FFB347", text: "#FFB347" },
  tripods:            { bg: "#FFB34720", border: "#FFB347", text: "#FFB347" },
  "bluetooth speakers": { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  "power banks":      { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  "usb flash drives": { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  "external hard drives": { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  // Bags
  backpacks:          { bg: "#A855F720", border: "#A855F7", text: "#A855F7" },
  "school bags":      { bg: "#A855F720", border: "#A855F7", text: "#A855F7" },
  // Fitness
  "yoga mats":        { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  "fitness trackers": { bg: "#43D9AD20", border: "#43D9AD", text: "#43D9AD" },
  // Bottles
  "water bottles":    { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  "sports bottles":   { bg: "#6C63FF20", border: "#6C63FF", text: "#6C63FF" },
  // Home / office
  "desk lamps":       { bg: "#FFD70020", border: "#FFD700", text: "#FFD700" },
  "coffee mugs":      { bg: "#FFB34720", border: "#FFB347", text: "#FFB347" },
};

// Example queries shown on the home screen
export const EXAMPLE_QUERIES = [
  "Pens under ₹100",
  "Running shoes under ₹5000",
  "Laptop for students under ₹50000",
  "Wireless earbuds under ₹2000",
  "Smartwatch under ₹3000",
  "Books under ₹500",
];

export const ASYNC_STORAGE_KEYS = {
  recentSearches: "@SmartShop:recentSearches",
};
