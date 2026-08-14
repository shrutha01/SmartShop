/**
 * QueryChip.js
 * A tappable suggestion chip for example queries and recent searches.
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export default function QueryChip({ label, onPress, variant = "example", icon }) {
  const isRecent = variant === "recent";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, isRecent ? styles.chipRecent : styles.chipExample]}
    >
      {icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : (
        <Text style={styles.icon}>{isRecent ? "🕐" : "✨"}</Text>
      )}
      <Text
        style={[styles.label, isRecent ? styles.labelRecent : styles.labelExample]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chipExample: {
    backgroundColor: "#6C63FF15",
    borderColor: "#6C63FF50",
  },
  chipRecent: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    maxWidth: 180,
  },
  labelExample: {
    color: COLORS.primary,
  },
  labelRecent: {
    color: COLORS.text.secondary,
  },
});
