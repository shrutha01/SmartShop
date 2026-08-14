/**
 * ProductCard.js
 * Displays a single product with image, details, match label and recommendation.
 * No AI/technical terms are shown to the user.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from "../constants/theme";

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <View style={styles.starsRow}>
      {Array(full).fill(0).map((_, i) => <Text key={`f${i}`} style={styles.starFull}>★</Text>)}
      {half && <Text style={styles.starHalf}>½</Text>}
      {Array(empty).fill(0).map((_, i) => <Text key={`e${i}`} style={styles.starEmpty}>☆</Text>)}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

/** Match label badge — shows only the label, no percentages or scores */
function MatchBadge({ label }) {
  const isTop = label === "Best Match";
  return (
    <View style={[styles.badge, isTop ? styles.badgeBest : styles.badgeGood]}>
      {isTop && <Text style={styles.sparkle}>✦ </Text>}
      <Text style={[styles.badgeText, isTop ? styles.badgeBestText : styles.badgeGoodText]}>
        {label}
      </Text>
    </View>
  );
}

export default function ProductCard({ product, onPress, index }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const catColors = CATEGORY_COLORS[product.category] || {
    bg: "#6C63FF20",
    border: "#6C63FF",
    text: "#6C63FF",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress && onPress(product)}
      style={styles.card}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {!imgError ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            onLoad={() => setImgLoading(false)}
            onError={() => { setImgError(true); setImgLoading(false); }}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackEmoji}>{getCategoryEmoji(product.category)}</Text>
          </View>
        )}
        {imgLoading && !imgError && (
          <View style={styles.imageLoader}>
            <ActivityIndicator color={COLORS.primary} size="small" />
          </View>
        )}
        {/* Category pill */}
        <View style={[styles.categoryPill, { backgroundColor: catColors.bg, borderColor: catColors.border }]}>
          <Text style={[styles.categoryPillText, { color: catColors.text }]}>
            {product.category}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name + badge */}
        <View style={styles.headerRow}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          {product.matchLabel && product.matchLabel !== "Match" && (
            <MatchBadge label={product.matchLabel} />
          )}
        </View>

        <Text style={styles.brandText}>{product.brand}</Text>

        {/* Price + Rating */}
        <View style={styles.priceRatingRow}>
          <Text style={styles.price}>₹{product.price.toLocaleString("en-IN")}</Text>
          <StarRating rating={product.rating} />
        </View>

        {/* Short description */}
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>

        {/* Natural recommendation note */}
        {product.explanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationIcon}>💡</Text>
            <Text style={styles.explanationText} numberOfLines={2}>
              {product.explanation}
            </Text>
          </View>
        )}

        {/* Feature chips */}
        {product.features && product.features.length > 0 && (
          <View style={styles.featureRow}>
            {product.features.slice(0, 3).map((feat, i) => (
              <View key={i} style={styles.featureChip}>
                <Text style={styles.featureChipText}>{feat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getCategoryEmoji(category) {
  const map = {
    pens: "✒️",
    notebooks: "📓",
    books: "📚",
    "running shoes": "👟",
    "formal shoes": "👞",
    sandals: "👡",
    "t-shirts": "👕",
    jeans: "👖",
    jackets: "🧥",
    sunglasses: "🕶️",
    wallets: "👛",
    belts: "🪡",
    handbags: "👜",
    watches: "⌚",
    smartwatches: "⌚",
    laptops: "💻",
    tablets: "📱",
    smartphones: "📱",
    headphones: "🎧",
    earbuds: "🎧",
    keyboards: "⌨️",
    "mechanical keyboards": "⌨️",
    "computer mice": "🖱️",
    "gaming mice": "🖱️",
    "gaming headsets": "🎧",
    monitors: "🖥️",
    cameras: "📷",
    tripods: "📷",
    "bluetooth speakers": "🔊",
    "power banks": "🔋",
    "usb flash drives": "💾",
    "external hard drives": "💾",
    backpacks: "🎒",
    "school bags": "🎒",
    "yoga mats": "🧘",
    "fitness trackers": "⌚",
    "water bottles": "💧",
    "sports bottles": "💧",
    "desk lamps": "💡",
    "coffee mugs": "☕",
  };
  return map[category] || "🛍️";
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: COLORS.surfaceElevated,
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  imageFallbackEmoji: { fontSize: 64 },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryPill: {
    position: "absolute",
    bottom: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    textTransform: "capitalize",
  },
  content: { padding: SPACING.lg },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  productName: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    flexShrink: 0,
  },
  badgeBest: { backgroundColor: "#FFD70020", borderWidth: 1, borderColor: "#FFD700" },
  badgeGood: { backgroundColor: "#6C63FF20", borderWidth: 1, borderColor: "#6C63FF" },
  badgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  badgeBestText: { color: "#FFD700" },
  badgeGoodText: { color: COLORS.primary },
  sparkle: { fontSize: FONTS.sizes.xs, color: "#FFD700" },
  brandText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.weights.medium,
  },
  priceRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  price: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.accent,
  },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 1 },
  starFull: { color: COLORS.rating, fontSize: FONTS.sizes.sm },
  starHalf: { color: COLORS.rating, fontSize: FONTS.sizes.xs },
  starEmpty: { color: COLORS.border, fontSize: FONTS.sizes.sm },
  ratingText: {
    color: COLORS.text.secondary,
    fontSize: FONTS.sizes.xs,
    marginLeft: 4,
    fontWeight: FONTS.weights.semibold,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  explanationBox: {
    flexDirection: "row",
    backgroundColor: "#6C63FF15",
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    gap: SPACING.xs,
  },
  explanationIcon: { fontSize: 14 },
  explanationText: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
    lineHeight: 17,
  },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  featureChip: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureChipText: {
    fontSize: 10,
    color: COLORS.text.muted,
    fontWeight: FONTS.weights.medium,
    textTransform: "capitalize",
  },
});
