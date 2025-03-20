import { View, type ViewProps } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

// Basic themed view that uses the theme's background color
const StyledView = styled(View)`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.background};
`;

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  return <StyledView style={style} {...otherProps} />;
}
