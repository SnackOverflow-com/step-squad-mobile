import React from "react";
import { TextInputProps as RNTextInputProps } from "react-native";
import { DefaultTheme } from "styled-components/native";

// Define text input types
export type TextInputState =
  | "default"
  | "focus"
  | "filled"
  | "error"
  | "disabled";
export type TextInputType = "normal" | "password" | "number" | "email";

// Define text input props
export interface TextInputProps extends Omit<RNTextInputProps, "disabled"> {
  label?: string;
  helperText?: string;
  type?: TextInputType;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDisabled?: boolean;
  disabled?: boolean;
}

export interface StyledTextInputContainerProps {
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}

export interface StyledTextInputProps {
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}
