import React from "react";
import { Text, TextProps } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

type FontWeight = "400" | "600" | "700";
type FontSize = "s" | "m" | "l" | "xl";

// Base text component with proper theme typing
const StyledText = styled(Text)<{
  weight: FontWeight;
  size: FontSize;
  color?: string;
}>`
  font-family: ${({
    theme,
    weight,
  }: {
    theme: DefaultTheme;
    weight: FontWeight;
  }) => {
    switch (weight) {
      case "700":
        return theme.fontFamily["700"];
      case "600":
        return theme.fontFamily["600"];
      default:
        return theme.fontFamily["400"];
    }
  }};

  font-size: ${({ theme, size }: { theme: DefaultTheme; size: FontSize }) => {
    return theme.fontSize[size];
  }}px;

  line-height: ${({ theme, size }: { theme: DefaultTheme; size: FontSize }) => {
    return theme.lineHeight[size];
  }}px;

  color: ${({ theme, color }: { theme: DefaultTheme; color?: string }) => {
    return color || theme.text;
  }};
`;

interface BaseTextProps extends TextProps {
  weight?: FontWeight;
  size?: FontSize;
  color?: string;
}

// Exported component with default props
export const BaseText: React.FC<BaseTextProps> = ({
  children,
  weight = "400",
  size = "m",
  color,
  ...props
}) => {
  return (
    <StyledText weight={weight} size={size} color={color} {...props}>
      {children}
    </StyledText>
  );
};
