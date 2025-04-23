import React, { useEffect, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Circle } from "react-native-svg";
import styled, { useTheme } from "styled-components/native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CircleChartProps } from "./types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Container = styled(View)`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled(View)`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

/**
 * A circular chart component that displays a value as a percentage of the circle
 * and always adapts to its parent container size.
 */
const CircleChart = ({
  value,
  maxValue,
  strokeWidth = 10,
  valueColor,
  backgroundColor,
  content,
  style,
}: CircleChartProps) => {
  const theme = useTheme();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Default colors from theme if not provided
  const circleColor = backgroundColor || theme.contrast[30];
  const arcColor = valueColor || theme.primary.main;

  // Calculate dimensions based on the smallest dimension (width or height)
  // to ensure we always have a perfect circle
  const size = Math.min(containerSize.width, containerSize.height);
  const radius = size > 0 ? (size - strokeWidth) / 2 : 0;
  const circumference = radius > 0 ? 2 * Math.PI * radius : 0;
  const center = size / 2;

  // Animation setup
  const progressValue = useSharedValue(0);

  // Calculate stroke-dashoffset based on value
  const animatedProps = useAnimatedProps(() => {
    // Avoid division by zero - if maxValue is 0, the progress is 0
    const progress = maxValue <= 0 ? 0 : progressValue.value / maxValue;
    const strokeDashoffset = circumference - progress * circumference;
    return {
      strokeDashoffset,
    };
  });

  // Handle container layout changes to get its dimensions
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Update the value animation when value changes
  useEffect(() => {
    // Only animate if we have valid dimensions
    if (radius > 0) {
      // Ensure value is capped at the maxValue and not less than 0
      const cappedValue = Math.min(Math.max(0, value), maxValue || 1); // Use 1 as fallback if maxValue is 0
      progressValue.value = withTiming(cappedValue, { duration: 800 });
    }
  }, [value, maxValue, progressValue, radius]);

  // Don't render the chart until we have valid dimensions
  if (size <= 0) {
    return <Container style={style} onLayout={handleLayout} />;
  }

  return (
    <Container style={style} onLayout={handleLayout}>
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

        {/* Value arc */}
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

      {content && size > 0 && (
        <ContentContainer style={{ width: size, height: size }}>
          {content}
        </ContentContainer>
      )}
    </Container>
  );
};

export default CircleChart;
