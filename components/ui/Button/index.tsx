import React from "react";
import { Animated, Pressable } from "react-native";
import styled from "styled-components/native";
import {
  buttonSizeStyles,
  getTextColor,
  getVariantStyles,
  StyledPressableProps,
} from "./variants";
import BaseText from "../BaseText";
import { ButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StyledPressable = styled(AnimatedPressable)<StyledPressableProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 16px;

  ${(props: StyledPressableProps) => buttonSizeStyles(props)}

  ${(props: StyledPressableProps) => getVariantStyles(props)}
`;

const ButtonText = styled(BaseText)<StyledPressableProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
        fontWeight="600"
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
