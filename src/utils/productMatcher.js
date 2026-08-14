/**
 * productMatcher.js
 * Scores and ranks products from the local dataset against extracted intent.
 *
 * KEY FIX: When a category is detected, ONLY products from that category
 * are scored (hard filter). Unrelated categories always return score = 0.
 *
 * Scoring weights (applied WITHIN the matched category):
 *   Category match      → 40 pts  (guaranteed when hard-filtered)
 *   Price within budget → 30 pts  (partial credit for slightly over)
 *   Use-case match      → 20 pts
 *   Feature/keyword     → 15 pts  (up to)
 *   Brand match         → 10 pts
 *   Rating bonus        →  5 pts  (proportional)
 */

import { PRODUCTS } from "../data/products";

const WEIGHTS = {
  category: 40,
  price: 30,
  useCase: 20,
  featureKeyword: 15,
  brand: 10,
  rating: 5,
};

/**
 * Score a single product against the extracted intent.
 * Category must already match (caller pre-filters).
 */
function scoreProduct(product, intent, categoryMatched) {
  let score = 0;
  const reasons = [];

  // ── 1. Category ────────────────────────────────────────────────────────
  if (categoryMatched) {
    score += WEIGHTS.category;
    // No need to add it to visible reasons — category is shown via the pill
  } else {
    // No category specified — partial credit so broad results still appear
    score += WEIGHTS.category * 0.25;
  }

  // ── 2. Price within budget ─────────────────────────────────────────────
  if (intent.maxPrice) {
    if (product.price <= intent.maxPrice) {
      score += WEIGHTS.price;
      reasons.push("Within your budget");
    } else if (product.price <= intent.maxPrice * 1.15) {
      score += WEIGHTS.price * 0.4;
      reasons.push("Close to your budget");
    } else if (intent.maxPrice && categoryMatched) {
      // Way over budget but still the right category — show as closest match
      reasons.push("Closest available match");
    }
  } else {
    score += WEIGHTS.price * 0.3;
  }

  if (intent.minPrice && product.price >= intent.minPrice) {
    score += 5;
  }

  // ── 3. Use-case match ──────────────────────────────────────────────────
  if (intent.useCase) {
    const ucLower = intent.useCase.toLowerCase();
    const productText = [
      (product.suitableFor || []).join(" "),
      product.description || "",
      (product.features || []).join(" "),
    ].join(" ").toLowerCase();

    const ucWords = ucLower.split(/[\s,]+/).filter((w) => w.length > 3);
    if (ucWords.some((w) => productText.includes(w))) {
      score += WEIGHTS.useCase;
      reasons.push(`Ideal for ${intent.useCase}`);
    }
  }

  // ── 4. Feature & keyword match ─────────────────────────────────────────
  // Only use features (not raw keywords) to avoid false matches on
  // generic words like "price", "under", "rupees" that crept into queries.
  const searchTokens = (intent.features || []).map((t) => t.toLowerCase());

  const productText = [
    product.name,
    product.description,
    ...(product.features || []),
    ...(product.keywords || []),
    ...(product.suitableFor || []),
  ]
    .join(" ")
    .toLowerCase();

  const matchedTokens = searchTokens.filter(
    (t) => t.length > 2 && productText.includes(t)
  );
  if (matchedTokens.length > 0) {
    score += Math.min(
      WEIGHTS.featureKeyword,
      (matchedTokens.length / Math.max(searchTokens.length, 1)) *
        WEIGHTS.featureKeyword
    );
  }

  // ── 5. Brand match ─────────────────────────────────────────────────────
  if (intent.brand) {
    if (product.brand.toLowerCase() === intent.brand.toLowerCase()) {
      score += WEIGHTS.brand;
      reasons.push(`Your preferred brand`);
    }
  }

  // ── 6. Rating bonus ────────────────────────────────────────────────────
  const ratingBonus = ((product.rating - 3.5) / 1.5) * WEIGHTS.rating;
  score += Math.max(0, ratingBonus);
  if (product.rating >= 4.3) {
    reasons.push(`Highly rated ${product.rating}★`);
  } else if (product.rating >= 4.0) {
    reasons.push("Well rated");
  }

  return { score: Math.round(score), reasons };
}

/**
 * Build a natural-language match explanation from reasons.
 */
function buildExplanation(reasons, score) {
  if (reasons.length === 0) return "Good match for your search.";
  return reasons.slice(0, 3).join(" · ");
}

/**
 * Return label for a match tier.
 */
function getMatchLabel(score) {
  if (score >= 70) return "Best Match";
  if (score >= 55) return "Great Match";
  if (score >= 40) return "Good Match";
  return "Match";
}

/**
 * Main function — filters and ranks products against intent.
 *
 * When category IS detected:
 *   - Hard filter: only products in that exact category are considered.
 *   - ALL matching products are returned (sorted by score, capped at 10).
 *   - This ensures unrelated categories NEVER appear.
 *
 * When category is NOT detected:
 *   - All products scored.
 *   - Only those above the minimum threshold are returned.
 */
export function rankProducts(intent) {
  const categoryKnown = Boolean(intent.category);

  // ── Hard filter by category ────────────────────────────────────────────
  let pool;
  if (categoryKnown) {
    pool = PRODUCTS.filter(
      (p) => p.category.toLowerCase() === intent.category.toLowerCase()
    );
    // If no products exist for that category, return empty
    if (pool.length === 0) return [];
  } else {
    pool = PRODUCTS;
  }

  // ── Score each product ─────────────────────────────────────────────────
  const scored = pool.map((product) => {
    const { score, reasons } = scoreProduct(product, intent, categoryKnown);
    return {
      ...product,
      score,
      matchLabel: getMatchLabel(score),
      explanation: buildExplanation(reasons, score),
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  if (categoryKnown) {
    // Return all products in that category (already filtered), capped at 10
    return scored.slice(0, 10);
  } else {
    // No category — require meaningful minimum score to filter noise
    const threshold = 18;
    return scored.filter((p) => p.score >= threshold).slice(0, 8);
  }
}
