/**
 * HomeScreen.js
 * Main landing screen: header, search bar, example chips, recent searches.
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import SearchBar from "../components/SearchBar";
import QueryChip from "../components/QueryChip";
import { COLORS, FONTS, SPACING, RADIUS, EXAMPLE_QUERIES } from "../constants/theme";
import { useRecentSearches } from "../utils/useRecentSearches";
import { extractIntent } from "../services/aiService";
import { rankProducts } from "../utils/productMatcher";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { recentSearches, addSearch, clearRecent } = useRecentSearches();

  const headerScale = useRef(new Animated.Value(1)).current;

  // ── Search handler ───────────────────────────────────────────────────────
  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) {
      Alert.alert("Empty Query", "Please enter something to search for.");
      return;
    }

    setIsLoading(true);

    // Navigate to Results screen immediately with loading state
    navigation.navigate("Results", {
      query: q,
      loading: true,
      results: [],
      intent: null,
      error: null,
    });

    try {
      // Extract intent (Gemini AI or local fallback)
      const intent = await extractIntent(q);
      // Rank products from local dataset
      const results = rankProducts(intent);
      // Persist to recent searches
      await addSearch(q);
      // Replace the loading Results entry with actual results
      navigation.replace("Results", {
        query: q,
        loading: false,
        results,
        intent,
        error: null,
      });
    } catch (err) {
      navigation.replace("Results", {
        query: q,
        loading: false,
        results: [],
        intent: null,
        error: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipPress = (chipQuery) => {
    setQuery(chipQuery);
    // Pass chipQuery directly so we don't rely on state update timing
    handleSearch(chipQuery);
  };

  // ── Logo bounce on mount ─────────────────────────────────────────────────
  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(headerScale, { toValue: 1.05, duration: 300, useNativeDriver: true }),
      Animated.spring(headerScale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <LinearGradient
          colors={["#1A0F3C", "#0F0F1A"]}
          style={styles.headerGradient}
        >
          <Animated.View style={[styles.logoRow, { transform: [{ scale: headerScale }] }]}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🛍️</Text>
            </View>
            <View>
              <Text style={styles.appName}>SmartShop</Text>
              <Text style={styles.tagline}>Smart shopping, naturally</Text>
            </View>
          </Animated.View>

        </LinearGradient>

        {/* ── Search Section ───────────────────────────────────────────────── */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionLabel}>What are you looking for?</Text>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmit={() => handleSearch()}
            placeholder='e.g. "Running shoes under ₹5000"'
          />

          <TouchableOpacity
            style={[styles.searchBtn, isLoading && styles.searchBtnDisabled]}
            onPress={() => handleSearch()}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={COLORS.gradient.primary}
              style={styles.searchBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.searchBtnText}>
                {isLoading ? "Searching..." : "🔍  Search"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Example Queries ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Try these searches</Text>
          <View style={styles.chipWrap}>
            {EXAMPLE_QUERIES.map((q, i) => (
              <QueryChip
                key={i}
                label={q}
                onPress={() => handleChipPress(q)}
                variant="example"
              />
            ))}
          </View>
        </View>

        {/* ── Recent Searches ──────────────────────────────────────────────── */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>🕐 Recent Searches</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipWrap}>
              {recentSearches.map((q, i) => (
                <QueryChip
                  key={i}
                  label={q}
                  onPress={() => handleChipPress(q)}
                  variant="recent"
                />
              ))}
            </View>
          </View>
        )}

        {/* ── How it Works ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ How SmartShop Works</Text>
          {[
            { icon: "💬", step: "1", title: "Search naturally", desc: "Type just like you'd ask a friend" },
            { icon: "🎯", step: "2", title: "Smart matching", desc: "Finds the right category, price range and features" },
            { icon: "📊", step: "3", title: "Ranked results", desc: "Products sorted by relevance to your query" },
            { icon: "📋", step: "4", title: "Clear recommendations", desc: "See why each product suits your needs" },
          ].map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={styles.stepIconBox}>
                <Text style={styles.stepEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{item.step}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SmartShop · 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl * 2,
  },
  // Header
  headerGradient: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  logoEmoji: {
    fontSize: 28,
  },
  appName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  aiBadge: {
    backgroundColor: "#6C63FF25",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "#6C63FF50",
  },
  aiBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
    letterSpacing: 0.3,
  },
  // Search section
  searchSection: {
    padding: SPACING.xl,
    gap: SPACING.md,
    marginTop: -SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.muted,
    fontWeight: FONTS.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  searchBtn: {
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginTop: SPACING.xs,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  searchBtnDisabled: {
    opacity: 0.6,
  },
  searchBtnGradient: {
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.2,
  },
  // Sections
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  clearText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: FONTS.weights.medium,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // How it works
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepEmoji: {
    fontSize: 22,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
    lineHeight: 16,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight + "30",
    borderWidth: 1,
    borderColor: COLORS.primary + "60",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  footer: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
  },
});
