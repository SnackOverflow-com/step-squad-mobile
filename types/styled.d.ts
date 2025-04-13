import "styled-components/native";

// Define the theme interface
declare module "styled-components/native" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    background: string;
    text: string;
    textSecondary: string;
    primary: {
      main: string;
      surface: string;
      border: string;
      hover: string;
      pressed: string;
      focus: string;
    };
    secondary: string;
    accent: string;
    border: string;
    card: string;
    error: {
      main: string;
      surface: string;
      border: string;
      hover: string;
      pressed: string;
      focus: string;
    };
    success: string;
    warning: string;
    info: {
      main: string;
      surface: string;
      border: string;
      hover: string;
      pressed: string;
      focus: string;
    };
    neutral: {
      [key: string]: string;
    };
    contrast: {
      [key: string]: string;
    };
    fontWeight: {
      "400": string;
      "600": string;
      "700": string;
    };
    fontSize: {
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
    lineHeight: {
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
  }
}
