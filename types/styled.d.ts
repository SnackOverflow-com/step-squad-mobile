import "styled-components/native";

// Define the theme interface
declare module "styled-components/native" {
  export interface DefaultTheme {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    card: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    fontFamily: {
      "400": string;
      "600": string;
      "700": string;
    };
    fontSize: {
      s: number;
      m: number;
      l: number;
      xl: number;
    };
    lineHeight: {
      s: number;
      m: number;
      l: number;
      xl: number;
    };
  }
}
