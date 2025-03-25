import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Home, Compass } from "lucide-react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useThemeContext } from "@/hooks";

export default function TabLayout() {
  const { theme } = useThemeContext();
  // const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          // height: 60 + (Platform.OS === "ios" ? 0 : insets.bottom),
          // paddingBottom: Platform.OS === "ios" ? 0 : insets.bottom,
          ...(Platform.OS === "ios" ? { position: "absolute" } : {}),
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Compass size={24} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
    </Tabs>
  );
}
