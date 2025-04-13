import { css, DefaultTheme } from "styled-components/native";
import { ButtonSize, ButtonVariant } from "./types";

export interface StyledPressableProps {
  variant: ButtonVariant;
  size: ButtonSize;
  isDisabled?: boolean;
  theme: DefaultTheme;
  pressed?: boolean;
}

export interface ButtonTextProps {
  variant: ButtonVariant;
  size: ButtonSize;
  isDisabled?: boolean;
  theme: DefaultTheme;
}

// Base button styles based on size
export const buttonSizeStyles = ({ size }: { size: ButtonSize }) => {
  switch (size) {
    case "s":
      return css`
        padding: 8px 16px;
      `;
    case "m":
      return css`
        padding: 12px 20px;
      `;
    case "l":
      return css`
        padding: 16px 24px;
      `;
    default:
      return css`
        padding: 12px 20px;
      `;
  }
};

// Disabled styles for all variants
export const disabledStyles = css<StyledPressableProps>`
  ${({ variant, theme }) => {
    if (variant === "outline" || variant === "ghost") {
      return css`
        background-color: transparent;
        border-color: ${variant === "outline"
          ? theme.contrast[50]
          : "transparent"};
      `;
    }

    return css`
      background-color: ${theme.contrast[50]};
      border-color: transparent;
    `;
  }}
  opacity: 0.5;
`;

// Primary button variant styles
export const primaryStyles = css<StyledPressableProps>`
  background-color: ${({ theme, pressed }) =>
    pressed ? theme.primary.pressed : theme.primary.main};
  border-color: transparent;
  border-width: 0;

  ${({ isDisabled }) => isDisabled && disabledStyles}
`;

// Secondary button variant styles
export const secondaryStyles = css<StyledPressableProps>`
  background-color: ${({ theme, pressed }) =>
    pressed ? `${theme.info.pressed}` : theme.info.main};
  border-color: transparent;
  border-width: 0;

  ${({ isDisabled }) => isDisabled && disabledStyles}
`;

// Outline button variant styles
export const outlineStyles = css<StyledPressableProps>`
  background-color: ${({ theme, pressed }) =>
    pressed ? "rgba(0, 0, 0, 0.03)" : "transparent"};
  border-color: ${({ theme }) => theme.border};
  border-width: 1px;

  ${({ isDisabled }) => isDisabled && disabledStyles}
`;

// Ghost button variant styles
export const ghostStyles = css<StyledPressableProps>`
  background-color: ${({ theme, pressed }) =>
    pressed ? "rgba(0, 0, 0, 0.03)" : "transparent"};
  border-color: transparent;
  border-width: 0;

  ${({ isDisabled }) => isDisabled && disabledStyles}
`;

// Get variant styles function
export const getVariantStyles = ({ variant }: { variant: ButtonVariant }) => {
  switch (variant) {
    case "primary":
      return primaryStyles;
    case "secondary":
      return secondaryStyles;
    case "outline":
      return outlineStyles;
    case "ghost":
      return ghostStyles;
    default:
      return primaryStyles;
  }
};

// Get text color function based on variant and state
export const getTextColor = ({
  variant,
  isDisabled,
  theme,
}: StyledPressableProps) => {
  if (isDisabled) {
    return variant === "outline" || variant === "ghost"
      ? theme.neutral[70]
      : theme.neutral[10];
  }

  return variant === "primary" || variant === "secondary"
    ? theme.neutral[10]
    : theme.contrast[80];
};
