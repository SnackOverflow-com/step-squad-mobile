import React, { useRef, useEffect } from "react";
import { View, Animated, TouchableOpacity, PanResponder } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";

import BaseText from "../BaseText";
import { CircleCheckIcon, CircleXIcon, XIcon } from "lucide-react-native";
import { useThemeContext } from "@/hooks";

export type ToastVariant = "success" | "error";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss: (id: string) => void;
  isStacked?: boolean;
}

const ToastContainer = styled(Animated.View)<{
  variant: ToastVariant;
  isStacked?: boolean;
}>`
  padding: 8px 8px 16px 16px;
  border-radius: 8px;
  flex-direction: row;
  align-items: flex-start;
  /* shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 8px; */
  elevation: 3;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.background};
  margin-top: ${({ isStacked }: { isStacked?: boolean }) =>
    isStacked ? "-24px" : "0px"};
`;

const TextContainer = styled(View)`
  flex: 1;
  margin-right: 8px;
`;

const CloseButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const SuccessIcon = styled(CircleCheckIcon)`
  margin-right: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.success};
`;

const ErrorIcon = styled(CircleXIcon)`
  margin-right: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.error.main};
`;

const Toast = ({
  id,
  title,
  description,
  variant = "success",
  onDismiss,
  isStacked = false,
}: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const { theme } = useThemeContext();

  const SWIPE_THRESHOLD = 80; // How far to swipe before dismissing (now a positive value)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        // Allow swiping in both directions
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          // Swiped past threshold in either direction - dismiss
          Animated.timing(translateX, {
            toValue: gesture.dx < 0 ? -500 : 500, // Swipe off screen in the appropriate direction
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onDismiss(id);
          });
        } else {
          // Not swiped far enough - bounce back
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDismiss(id);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss, opacity, translateY]);

  return (
    <ToastContainer
      style={{
        opacity,
        transform: [{ translateY }, { translateX }],
        border: `1px solid ${theme.border}`,
      }}
      variant={variant}
      isStacked={isStacked}
      {...panResponder.panHandlers}
    >
      {variant === "success" ? (
        <SuccessIcon size={24} color={theme.success} />
      ) : (
        <ErrorIcon size={24} color={theme.error.main} />
      )}

      <TextContainer>
        {title && (
          <BaseText size="m" fontWeight="600">
            {title}
          </BaseText>
        )}

        {description && (
          <BaseText color={70} size="xs">
            {description}
          </BaseText>
        )}
      </TextContainer>

      <CloseButton onPress={() => onDismiss(id)}>
        <XIcon size={20} color={theme.text} />
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;
