import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

// Define our theme types
export type ThemeMode = "light" | "dark";

// Shared typography styles between themes
const typography = {
  fontWeight: {
    "400": "ManropeRegular",
    "600": "ManropeSemiBold",
    "700": "ManropeBold",
  },
  fontSize: {
    xs: 12,
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

export const primaryColors = {
  main: "#FF9A01",
  surface: "#FFEBCC",
  border: "#FFDDAA",
  hover: "#D48001",
  pressed: "#804D01",
  focus: "#FFEBCC",
};

export const infoColors = {
  main: "#0167FF",
  surface: "#CCE1FF",
  border: "#E4E9ED",
  hover: "#0156D4",
  pressed: "#013480",
  focus: "#CCE1FF",
};

export const errorColors = {
  main: "#ED1F4F",
  surface: "#FBD2DC",
  border: "#F9B4C4",
  hover: "#C51A42",
  pressed: "#771028",
  focus: "#FBD2DC",
};

export const neutralColors = {
  10: "#FFFFFF",
  20: "#EDF1F5",
  30: "#E4E9ED",
  40: "#DCE0E4",
  50: "#C3C7CA",
  60: "#A6A9AC",
  70: "#858789",
  80: "#747677",
  90: "#595A5B",
  100: "#2D2E2E",
};

export const contrastColors = (mode: ThemeMode) => {
  const isLight = mode === "light";
  return {
    10: isLight ? neutralColors[10] : neutralColors[90],
    20: isLight ? neutralColors[20] : neutralColors[80],
    30: isLight ? neutralColors[30] : neutralColors[70],
    40: isLight ? neutralColors[40] : neutralColors[60],
    50: isLight ? neutralColors[50] : neutralColors[50],
    60: isLight ? neutralColors[60] : neutralColors[40],
    70: isLight ? neutralColors[70] : neutralColors[30],
    80: isLight ? neutralColors[80] : neutralColors[20],
    90: isLight ? neutralColors[90] : neutralColors[10],
    100: isLight ? neutralColors[100] : neutralColors[10],
  };
};

// Define theme colors for both modes
export const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#555555",
  primary: primaryColors,
  secondary: "#5A8CA8",
  accent: "#3A5F77",
  border: "#E1E1E1",
  card: "#F5F5F5",
  error: errorColors,
  success: "#388E3C",
  warning: "#F57C00",
  neutral: neutralColors,
  contrast: contrastColors("light"),
  info: infoColors,
  ...typography,
};

export const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  primary: primaryColors,
  secondary: "#2A5769",
  accent: "#4A93B5",
  border: "#333333",
  card: "#1E1E1E",
  error: errorColors,
  success: "#66BB6A",
  warning: "#FFA726",
  neutral: neutralColors,
  contrast: contrastColors("dark"),
  info: infoColors,
  ...typography,
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
