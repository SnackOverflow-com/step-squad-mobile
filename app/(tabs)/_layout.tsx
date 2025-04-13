import { Slot } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { CustomTabBar } from "../../src/components/ui/CustomTabBar";

export default function TabLayout() {
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
