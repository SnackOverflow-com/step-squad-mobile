import { Slot } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
// Remove commented icon imports
// Remove commented HapticTab and TabBarBackground imports
import { useThemeContext } from "@/hooks";
import { CustomTabBar } from "../../src/components/ui/CustomTabBar";

export default function TabLayout() {
  const { theme } = useThemeContext();

  return (
    <View style={styles.container}>
      <Slot />
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
