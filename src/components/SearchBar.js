/**
 * SearchBar.js
 * Animated search bar with microphone icon (decorative) and clear button.
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Try "Running shoes under ₹5000"',
  autoFocus = false,
  editable = true,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation on the search icon when active
  useEffect(() => {
    if (value.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [value.length > 0]);

  const handleFocus = () => {
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      {/* Search icon */}
      <Animated.Text style={[styles.searchIcon, { transform: [{ scale: pulseAnim }] }]}>
        🔍
      </Animated.Text>

      {/* Text Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        returnKeyType="search"
        autoFocus={autoFocus}
        editable={editable}
        multiline={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor={COLORS.primary}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearBtnText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  searchIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    fontWeight: FONTS.weights.regular,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    fontSize: 10,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weights.bold,
  },
});
