import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled, { DefaultTheme, useTheme } from "styled-components/native";

type SafeAreaWrapperProps = PropsWithChildren & {
  topInset?: boolean;
  bottomInset?: boolean;
  style?: ViewProps["style"];
  backgroundColor?: string;
  statusBarStyle?: "dark-content" | "light-content" | "default";
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
  statusBarStyle = "default",
}: SafeAreaWrapperProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Use the provided backgroundColor or fall back to theme background color
  const bgColor = backgroundColor || theme.background;

  return (
    <>
      <StatusBar
        backgroundColor={bgColor}
        barStyle={statusBarStyle}
        translucent
      />

      <Container
        style={[
          styles.container,
          {
            paddingTop: topInset ? insets.top : 0,
            paddingBottom: bottomInset ? insets.bottom : 0,
            backgroundColor: bgColor,
          },
          style,
        ]}
      >
        {children}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
