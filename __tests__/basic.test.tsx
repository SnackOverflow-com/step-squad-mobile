/* eslint-disable import/first */
/**
 * Component tests for the mobile app
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { describe, it, expect } from "@jest/globals";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { ReactTestInstance } from "react-test-renderer";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock safe area context
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 48, bottom: 34, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Import after mocking dependencies
import InfoMessage from "../components/InfoMessage";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { ThemeMode } from "../hooks/useThemeContext";

// Mock theme for testing based on the app's theme structure
const mockTheme = {
  mode: "light" as ThemeMode,
  background: "#FFFFFF",
  text: "#2D2E2E",
  textSecondary: "#858789",
  primary: {
    main: "#FF9A01",
    surface: "#FFEBCC",
    border: "#FFDDAA",
    hover: "#D48001",
    pressed: "#804D01",
    focus: "#FFEBCC",
  },
  secondary: "#5A8CA8",
  accent: "#3A5F77",
  border: "#E1E1E1",
  card: "#f8f8f8",
  error: {
    main: "#ED1F4F",
    surface: "#FBD2DC",
    border: "#F9B4C4",
    hover: "#C51A42",
    pressed: "#771028",
    focus: "#FBD2DC",
  },
  success: "#388E3C",
  warning: "#F57C00",
  neutral: {
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
  },
  contrast: {
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
  },
  info: {
    main: "#0167FF",
    surface: "#CCE1FF",
    border: "#E4E9ED",
    hover: "#0156D4",
    pressed: "#013480",
    focus: "#CCE1FF",
  },
  fontWeight: {
    "400": "ManropeRegular",
    "600": "ManropeSemiBold",
    "700": "ManropeBold",
  },
  fontSize: {
    xs: "12px",
    s: "14px",
    m: "16px",
    l: "18px",
    xl: "20px",
    xxl: "24px",
  },
  lineHeight: {
    xs: "16px",
    s: "20px",
    m: "24px",
    l: "28px",
    xl: "32px",
    xxl: "36px",
  },
};

describe("InfoMessage Component", () => {
  it("renders correctly with all required props", () => {
    const { getByText } = render(
      <ThemeProvider theme={mockTheme}>
        <InfoMessage
          icon={<Text>Icon</Text>}
          title="Test Title"
          content="Test Content"
        />
      </ThemeProvider>
    );

    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Content")).toBeTruthy();
    expect(getByText("Icon")).toBeTruthy();
  });

  it("renders with optional action component", () => {
    const { getByText } = render(
      <ThemeProvider theme={mockTheme}>
        <InfoMessage
          icon={<Text>Icon</Text>}
          title="Test Title"
          content="Test Content"
          action={<Text>Action Button</Text>}
        />
      </ThemeProvider>
    );

    expect(getByText("Action Button")).toBeTruthy();
  });
});

describe("SafeAreaWrapper Component", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <ThemeProvider theme={mockTheme}>
        <SafeAreaWrapper>
          <Text>Test Content</Text>
        </SafeAreaWrapper>
      </ThemeProvider>
    );

    expect(getByText("Test Content")).toBeTruthy();
  });

  it("applies custom background color when provided", () => {
    const testColor = "#FF0000";

    const { UNSAFE_root } = render(
      <ThemeProvider theme={mockTheme}>
        <SafeAreaWrapper backgroundColor={testColor}>
          <View />
        </SafeAreaWrapper>
      </ThemeProvider>
    );

    // The Container component inside SafeAreaWrapper should have the background color
    // Using UNSAFE_root to access the render tree directly
    const safeAreaInstance = UNSAFE_root.findByType(SafeAreaWrapper);
    const containerInstance = safeAreaInstance.children[1] as ReactTestInstance;
    const styles = containerInstance.props.style as StyleProp<ViewStyle>[];

    // Find the style object with backgroundColor property
    const bgColorObject = styles.find(
      (style) =>
        style && typeof style === "object" && "backgroundColor" in style
    ) as ViewStyle;

    expect(bgColorObject).toBeDefined();
    expect(bgColorObject.backgroundColor).toBe(testColor);
  });

  it("applies safe area insets correctly", () => {
    const { UNSAFE_root } = render(
      <ThemeProvider theme={mockTheme}>
        <SafeAreaWrapper>
          <View />
        </SafeAreaWrapper>
      </ThemeProvider>
    );

    // The Container component inside SafeAreaWrapper should have the padding values
    const safeAreaInstance = UNSAFE_root.findByType(SafeAreaWrapper);
    const containerInstance = safeAreaInstance.children[1] as ReactTestInstance;
    const styles = containerInstance.props.style as StyleProp<ViewStyle>[];

    // Find the style object with padding properties
    const paddingObject = styles.find(
      (style) =>
        style &&
        typeof style === "object" &&
        "paddingTop" in style &&
        "paddingBottom" in style
    ) as ViewStyle;

    expect(paddingObject).toBeDefined();
    expect(paddingObject.paddingTop).toBe(48); // From mock insets
    expect(paddingObject.paddingBottom).toBe(34); // From mock insets
  });
});
