/**
 * useRecentSearches.js
 * Custom hook — persists and retrieves recent search queries using AsyncStorage.
 */

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_KEYS } from "../constants/theme";

const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState([]);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.recentSearches);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (_) {
        // Silently ignore storage errors
      }
    })();
  }, []);

  const addSearch = useCallback(async (query) => {
    if (!query || query.trim().length === 0) return;
    const trimmed = query.trim();

    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
      // Persist asynchronously
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS.recentSearches, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const clearRecent = useCallback(async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.recentSearches);
    } catch (_) {}
  }, []);

  return { recentSearches, addSearch, clearRecent };
}
