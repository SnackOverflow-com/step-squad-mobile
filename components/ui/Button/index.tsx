import React from "react";
import { Pressable, Text, PressableProps, Animated } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import {
  StyledPressableProps,
  buttonSizeStyles,
  getVariantStyles,
  getTextColor,
} from "./variants";

// Define button types
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "s" | "m" | "l";

// Define button props
interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StyledPressable = styled(AnimatedPressable)<StyledPressableProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 16px;

  /* Apply size styles */
  ${(props: StyledPressableProps) => buttonSizeStyles(props)}

  /* Apply variant-specific styles */
  ${(props: StyledPressableProps) => getVariantStyles(props)}
`;

const ButtonText = styled(Text)<StyledPressableProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.fontFamily["600"]};
  font-size: ${({ theme, size }: { theme: DefaultTheme; size: ButtonSize }) =>
    `${theme.fontSize[size]}px`};
  text-align: center;
  color: ${(props: StyledPressableProps) => getTextColor(props)};
`;

const Button = ({
  variant = "primary",
  size = "m",
  isDisabled = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) => {
  // Use either isDisabled prop or standard disabled prop
  const isButtonDisabled = isDisabled || disabled;
  const [pressed, setPressed] = React.useState(false);

  // Create animation value for scale
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Animation functions
  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };

  return (
    <StyledPressable
      variant={variant}
      size={size}
      isDisabled={isButtonDisabled}
      disabled={isButtonDisabled}
      pressed={pressed}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...props}
    >
      <ButtonText
        variant={variant}
        size={size}
        isDisabled={isButtonDisabled}
        pressed={pressed}
      >
        {children}
      </ButtonText>
    </StyledPressable>
  );
};

export default Button;
