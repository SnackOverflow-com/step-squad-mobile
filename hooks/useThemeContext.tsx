import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { css } from "styled-components/native";

// Define our theme types
export type ThemeMode = "light" | "dark";

// Shared typography styles between themes
const typography = {
  fontFamily: {
    "400": "ManropeRegular",
    "600": "ManropeSemiBold",
    "700": "ManropeBold",
  },
  fontSize: {
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
  },
  lineHeight: {
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
  },
};

// Define theme colors for both modes
export const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#555555",
  primary: "#A1CEDC",
  secondary: "#5A8CA8",
  accent: "#3A5F77",
  border: "#E1E1E1",
  card: "#F5F5F5",
  error: "#D32F2F",
  success: "#388E3C",
  warning: "#F57C00",
  info: "#0288D1",
  ...typography, // Add typography styles to the theme
};

export const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  primary: "#1D3D47",
  secondary: "#2A5769",
  accent: "#4A93B5",
  border: "#333333",
  card: "#1E1E1E",
  error: "#EF5350",
  success: "#66BB6A",
  warning: "#FFA726",
  info: "#29B6F6",
  ...typography, // Add typography styles to the theme
};

// Create the context with default values
type ThemeContextType = {
  theme: typeof lightTheme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
};

const defaultContext: ThemeContextType = {
  theme: lightTheme,
  themeMode: "light",
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Create the ThemeProvider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get the device color scheme
  const deviceColorScheme = useColorScheme();

  // Initialize theme based on device preference
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    deviceColorScheme === "dark" ? "dark" : "light"
  );

  // Update the theme when device preference changes
  useEffect(() => {
    if (deviceColorScheme) {
      setThemeMode(deviceColorScheme === "dark" ? "dark" : "light");
    }
  }, [deviceColorScheme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Get the current theme object
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext;
