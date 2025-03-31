import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import styled, { useTheme } from "styled-components/native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CircleLoaderProps } from "./types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Container = styled(View)`
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled(View)`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

/**
 * A circular progress loader component that displays progress with a circle arc
 * and allows for custom content in the center.
 */
const CircleLoader = ({
  progress,
  maxValue,
  strokeWidth = 10,
  size = 120,
  progressColor,
  backgroundColor,
  content,
  style,
}: CircleLoaderProps) => {
  const theme = useTheme();

  // Default colors from theme if not provided
  const circleColor = backgroundColor || theme.contrast[30];
  const arcColor = progressColor || theme.primary.main;

  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animation setup
  const progressValue = useSharedValue(0);

  // Calculate stroke-dashoffset based on progress
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (progressValue.value / maxValue) * circumference;
    return {
      strokeDashoffset,
    };
  });

  // Update the progress animation when progress changes
  useEffect(() => {
    // Ensure progress is capped at the maxValue
    const cappedProgress = Math.min(Math.max(0, progress), maxValue);
    progressValue.value = withTiming(cappedProgress, { duration: 500 });
  }, [progress, maxValue, progressValue]);

  return (
    <Container style={style}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          // Start from the top (rotated -90 degrees)
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>

      {content && (
        <ContentContainer style={{ width: size, height: size }}>
          {content}
        </ContentContainer>
      )}
    </Container>
  );
};

export default CircleLoader;
