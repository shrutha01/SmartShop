/**
 * EmptyState.js
 * Shown when no products match the search query.
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export default function EmptyState({ query, onTryAgain }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔎</Text>
      <Text style={styles.title}>No Products Found</Text>
      <Text style={styles.subtitle}>
        We couldn't find any products matching{"\n"}
        <Text style={styles.queryText}>"{query}"</Text>
      </Text>

      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Try these tips:</Text>
        {[
          "Use simpler keywords",
          "Try a different category",
          'Increase your budget range',
          'e.g. "headphones under ₹3000"',
        ].map((tip, i) => (
          <Text key={i} style={styles.tipItem}>
            • {tip}
          </Text>
        ))}
      </View>

      {onTryAgain && (
        <TouchableOpacity style={styles.btn} onPress={onTryAgain} activeOpacity={0.8}>
          <Text style={styles.btnText}>Try Another Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
    backgroundColor: COLORS.background,
  },
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  queryText: {
    color: COLORS.primary,
    fontStyle: "italic",
  },
  tipsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: "100%",
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.md,
  },
});
