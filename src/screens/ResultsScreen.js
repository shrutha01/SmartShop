/**
 * ResultsScreen.js
 * Displays search results: filter summary, product cards, sort options.
 * All AI/technical terminology is hidden from the user.
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import ProductCard from "../components/ProductCard";
import LoadingOverlay from "../components/LoadingOverlay";
import EmptyState from "../components/EmptyState";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

/** Small filter pill shown under the results header */
function FilterPill({ label, color }) {
  return (
    <View style={[styles.pill, { backgroundColor: color + "18", borderColor: color + "50" }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export default function ResultsScreen({ navigation, route }) {
  const { query, loading, results, intent, error } = route.params || {};

  const [sortBy, setSortBy] = React.useState("relevance");

  const sortedResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    const copy = [...results];
    switch (sortBy) {
      case "price_asc":  return copy.sort((a, b) => a.price - b.price);
      case "price_desc": return copy.sort((a, b) => b.price - a.price);
      case "rating":     return copy.sort((a, b) => b.rating - a.rating);
      default:           return copy.sort((a, b) => b.score - a.score);
    }
  }, [results, sortBy]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingOverlay query={query} />;

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Search Failed</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>← Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── No results ───────────────────────────────────────────────────────────
  if (!sortedResults || sortedResults.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState query={query} onTryAgain={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  // ── Build natural filter pills ───────────────────────────────────────────
  const filterPills = [];
  if (intent) {
    if (intent.category) {
      // Capitalise each word
      const cap = intent.category.replace(/\b\w/g, (c) => c.toUpperCase());
      filterPills.push({ label: cap, color: "#6C63FF" });
    }
    if (intent.maxPrice) {
      filterPills.push({
        label: `Under ₹${intent.maxPrice.toLocaleString("en-IN")}`,
        color: "#43D9AD",
      });
    }
    if (intent.useCase) {
      const cap = intent.useCase.replace(/\b\w/g, (c) => c.toUpperCase());
      filterPills.push({ label: `For ${cap}`, color: "#FFB347" });
    }
    if (intent.brand) {
      filterPills.push({ label: intent.brand, color: "#FF6B6B" });
    }
    if (intent.features && intent.features.includes("wireless")) {
      filterPills.push({ label: "Wireless", color: "#A855F7" });
    }
  }

  // ── Results header ───────────────────────────────────────────────────────
  const renderHeader = () => (
    <View>
      {/* Top bar */}
      <LinearGradient colors={["#1A0F3C", "#0F0F1A"]} style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {sortedResults.length} Result{sortedResults.length !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.topBarSub} numberOfLines={1}>
            for "{query}"
          </Text>
        </View>
        {/* Empty spacer to keep title centered */}
        <View style={styles.backBtn} />
      </LinearGradient>

      {/* Natural filter summary */}
      {filterPills.length > 0 && (
        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>Showing results for</Text>
          <View style={styles.pillRow}>
            {filterPills.map((p, i) => (
              <FilterPill key={i} label={p.label} color={p.color} />
            ))}
          </View>
        </View>
      )}

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortBtns}>
          {[
            { key: "relevance",  label: "✦ Relevance" },
            { key: "price_asc",  label: "₹ Low→High" },
            { key: "price_desc", label: "₹ High→Low" },
            { key: "rating",     label: "★ Rating" },
          ].map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => setSortBy(s.key)}
              style={[styles.sortBtn, sortBy === s.key && styles.sortBtnActive]}
            >
              <Text style={[styles.sortBtnText, sortBy === s.key && styles.sortBtnTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={sortedResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            onPress={(product) => navigation.navigate("ProductDetail", { product })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: SPACING.xxxl * 2 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  backBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    flexShrink: 0,
    minWidth: 60,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  topBarCenter: { flex: 1, alignItems: "center" },
  topBarTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text.primary,
  },
  topBarSub: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
    marginTop: 1,
  },

  // Filter summary
  filterBox: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  filterLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  pill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },

  // Sort bar
  sortBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  sortLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sortBtns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  sortBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sortBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortBtnText: {
    fontSize: 11,
    color: COLORS.text.muted,
    fontWeight: FONTS.weights.medium,
  },
  sortBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: FONTS.weights.bold,
  },

  // Error state
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
    backgroundColor: COLORS.background,
  },
  errorEmoji: { fontSize: 64, marginBottom: SPACING.lg },
  errorTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  errorMsg: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.md,
  },
});
