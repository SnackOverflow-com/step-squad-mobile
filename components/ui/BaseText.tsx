import React from "react";
import { Text, TextProps } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

type FontWeight = "400" | "600" | "700";
type FontSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";

// Base text component with proper theme typing
const StyledText = styled(Text)<{
  fontWeight: FontWeight;
  size: FontSize;
  color?: string;
}>`
  font-family: ${({
    theme,
    fontWeight,
  }: {
    theme: DefaultTheme;
    fontWeight: FontWeight;
  }) => {
    switch (fontWeight) {
      case "700":
        return theme.fontWeight["700"];
      case "600":
        return theme.fontWeight["600"];
      default:
        return theme.fontWeight["400"];
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
  fontWeight?: FontWeight;
  size?: FontSize;
  color?: string;
}

// Exported component with default props
const BaseText: React.FC<BaseTextProps> = ({
  children,
  fontWeight = "400",
  size = "m",
  color,
  ...props
}) => {
  return (
    <StyledText fontWeight={fontWeight} size={size} color={color} {...props}>
      {children}
    </StyledText>
  );
};

export default BaseText;
