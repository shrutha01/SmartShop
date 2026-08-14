/**
 * LoadingOverlay.js
 * Full-screen animated loading state shown while the AI processes the query.
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";

const STEPS = [
  { emoji: "🔍", text: "Finding the best matches..." },
  { emoji: "🏷️", text: "Filtering by category & budget..." },
  { emoji: "🛍️", text: "Sorting products for you..." },
  { emoji: "✨", text: "Almost ready..." },
];

export default function LoadingOverlay({ query }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = React.useState(0);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 8, useNativeDriver: true }),
    ]).start();

    // Dot bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    // Step rotation
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 900);

    return () => clearInterval(timer);
  }, []);

  const dotScale = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });

  const currentStep = STEPS[stepIndex];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Animated emoji */}
        <Animated.Text style={[styles.emoji, { transform: [{ scale: dotScale }] }]}>
          {currentStep.emoji}
        </Animated.Text>

        {/* Step text */}
        <Text style={styles.stepText}>{currentStep.text}</Text>

        {/* Query preview */}
        {query ? (
          <View style={styles.queryBox}>
            <Text style={styles.queryLabel}>Searching for:</Text>
            <Text style={styles.queryText} numberOfLines={2}>
              "{query}"
            </Text>
          </View>
        ) : null}

        {/* Dots loader */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ scale: i === stepIndex % 3 ? dotScale : 1 }],
                  backgroundColor: i === stepIndex % 3 ? COLORS.primary : COLORS.border,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.xxxl,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  stepText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  queryBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.xl,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  queryLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.muted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  queryText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    fontStyle: "italic",
  },
  dotsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
