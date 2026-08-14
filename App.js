/**
 * App.js — SmartShop AI root
 * Sets up React Navigation stack with dark theme.
 */

import React from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import { COLORS } from "./src/constants/theme";

const Stack = createNativeStackNavigator();

// Spread DarkTheme so the required `fonts` property (used internally by
// react-navigation v7) is always present. Only `colors` is overridden.
const darkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text.primary,
    border: COLORS.border,
    notification: COLORS.secondary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <NavigationContainer theme={darkNavTheme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,           // Custom headers in each screen
            animation: "slide_from_right",
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
