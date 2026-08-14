/**
 * ProductDetailScreen.js
 * Full product detail view with image, specs, and recommendation summary.
 * No AI/technical labels shown to the user.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
      <Text style={styles.ratingText}>{rating.toFixed(1)} / 5.0</Text>
    </View>
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

export default function ProductDetailScreen({ navigation, route }) {
  const { product } = route.params || {};
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorEmoji}>❌</Text>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const catColors = CATEGORY_COLORS[product.category] || {
    bg: "#6C63FF20",
    border: "#6C63FF",
    text: "#6C63FF",
  };

  // Determine match label colour
  const isTopMatch = product.matchLabel === "Best Match" || product.matchLabel === "Great Match";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back button overlay */}
        <TouchableOpacity style={styles.backOverlay} onPress={() => navigation.goBack()}>
          <View style={styles.backCircle}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>

        {/* Product image */}
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
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          )}
          <LinearGradient colors={["transparent", COLORS.background]} style={styles.imageGradient} />
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          {/* Category + Match */}
          <View style={styles.topRow}>
            <View style={[styles.categoryPill, { backgroundColor: catColors.bg, borderColor: catColors.border }]}>
              <Text style={[styles.categoryPillText, { color: catColors.text }]}>
                {getCategoryEmoji(product.category)} {product.category}
              </Text>
            </View>
            {product.matchLabel && isTopMatch && (
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>✦ {product.matchLabel}</Text>
              </View>
            )}
          </View>

          {/* Name & Brand */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandName}>{product.brand}</Text>

          {/* Price + Rating */}
          <View style={styles.priceRatingRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString("en-IN")}</Text>
            <StarRating rating={product.rating} />
          </View>

          {/* Recommendation note (only if available and meaningful) */}
          {product.explanation && product.explanation !== "Good match for your search." && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationHeader}>💡 Why we recommend this</Text>
              <Text style={styles.explanationText}>{product.explanation}</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>📝 About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>⚡ Key Features</Text>
              <View style={styles.featureGrid}>
                {product.features.map((feat, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Text style={styles.featureDot}>✓</Text>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Suitable For */}
          {product.suitableFor && product.suitableFor.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>👥 Ideal For</Text>
              <View style={styles.suitableWrap}>
                {product.suitableFor.map((s, i) => (
                  <View key={i} style={styles.suitableChip}>
                    <Text style={styles.suitableText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>← Back to Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: SPACING.xxxl * 2 },

  // Back overlay
  backOverlay: { position: "absolute", top: SPACING.lg, left: SPACING.lg, zIndex: 10 },
  backCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#00000060",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  backArrow: { color: "#FFF", fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },

  // Image
  imageContainer: { width: "100%", height: 300, position: "relative", backgroundColor: COLORS.surfaceElevated },
  image: { width: "100%", height: "100%" },
  imageFallback: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  imageFallbackEmoji: { fontSize: 80 },
  imageLoader: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  imageGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 120 },

  // Content
  contentCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: SPACING.xl,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md },
  categoryPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1,
  },
  categoryPillText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, textTransform: "capitalize" },
  matchBadge: {
    backgroundColor: "#FFD70020", borderWidth: 1, borderColor: "#FFD700",
    paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  matchBadgeText: { fontSize: 10, color: "#FFD700", fontWeight: FONTS.weights.bold },

  productName: {
    fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold,
    color: COLORS.text.primary, lineHeight: 30, marginBottom: SPACING.xs,
  },
  brandName: { fontSize: FONTS.sizes.md, color: COLORS.text.secondary, marginBottom: SPACING.md, fontWeight: FONTS.weights.medium },

  priceRatingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.lg },
  price: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.extrabold, color: COLORS.accent },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  starFull: { color: COLORS.rating, fontSize: FONTS.sizes.md },
  starHalf: { color: COLORS.rating, fontSize: FONTS.sizes.sm },
  starEmpty: { color: COLORS.border, fontSize: FONTS.sizes.md },
  ratingText: { color: COLORS.text.secondary, fontSize: FONTS.sizes.xs, marginLeft: 4, fontWeight: FONTS.weights.semibold },

  // Recommendation box
  explanationBox: {
    backgroundColor: "#6C63FF12", borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: "#6C63FF40",
  },
  explanationHeader: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.primary, marginBottom: SPACING.sm },
  explanationText: { fontSize: FONTS.sizes.sm, color: COLORS.text.secondary, lineHeight: 20 },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.lg },

  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text.primary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  description: { fontSize: FONTS.sizes.sm, color: COLORS.text.secondary, lineHeight: 22, marginBottom: SPACING.md },

  // Features
  featureGrid: { gap: SPACING.xs, marginBottom: SPACING.md },
  featureItem: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.sm },
  featureDot: { color: COLORS.accent, fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.md, lineHeight: 20 },
  featureText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text.secondary, lineHeight: 20, textTransform: "capitalize" },

  // Suitable for
  suitableWrap: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs, marginBottom: SPACING.md },
  suitableChip: {
    backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.border,
  },
  suitableText: { fontSize: FONTS.sizes.xs, color: COLORS.text.secondary, textTransform: "capitalize" },

  // Back button
  backBtn: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingVertical: SPACING.md, alignItems: "center",
    borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.xl,
  },
  backBtnText: { color: COLORS.primary, fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.md },

  // Error
  errorBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xxxl },
  errorEmoji: { fontSize: 64, marginBottom: SPACING.lg },
  errorText: { fontSize: FONTS.sizes.xl, color: COLORS.text.primary, marginBottom: SPACING.lg },
  backLink: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },
});
