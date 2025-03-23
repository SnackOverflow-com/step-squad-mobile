import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled, { DefaultTheme } from "styled-components/native";

type SafeAreaWrapperProps = PropsWithChildren & {
  topInset?: boolean;
  bottomInset?: boolean;
  style?: ViewProps["style"];
  backgroundColor?: string;
};

// Inner container that applies the safe area insets
const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.background};
`;

/**
 * A wrapper component that provides safe area insets for screens
 * Especially useful for handling status bar heights on Android
 */
export const SafeAreaWrapper = ({
  children,
  topInset = true,
  bottomInset = true,
  style,
  backgroundColor,
}: SafeAreaWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Container
      style={[
        styles.container,
        {
          paddingTop: topInset ? insets.top : 0,
          paddingBottom: bottomInset ? insets.bottom : 0,
          backgroundColor: backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
