import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Home, User, Users } from "lucide-react-native";
import { useThemeContext, lightTheme } from "@/hooks";

const tabs = [
  { name: "index", icon: Home, path: "/" },
  { name: "friends", icon: Users, path: "/friends" },
  { name: "profile", icon: User, path: "/profile" },
];

// Define a function that creates the styles based on the theme
const getStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: 60, // Adjust height as needed
      borderWidth: 1,
      borderColor: theme.contrast[30], // Use a theme value
      borderRadius: 12,
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,
      backgroundColor: theme.background,
      shadowColor: theme.contrast[30],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 5,
    },
    tabButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export const CustomTabBar = () => {
  const router = useRouter();
  const segments = useSegments();
  const { theme } = useThemeContext();

  // Get the dynamic styles based on the current theme
  const styles = getStyles(theme);

  // Determine the active tab based on the current route segments
  // The segment for the tabs layout is usually the first one, e.g., '(tabs)'
  // The actual screen segment comes after, e.g., 'index', 'explore'
  // If segments[1] is undefined or empty, default to 'index'
  const activeTab = segments[1] || "index";

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;
        const color = isActive ? theme.primary.main : theme.text; // Use primary color for active

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => handlePress(tab.path)}
          >
            <Icon size={24} color={color} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
