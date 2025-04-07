import { ReactNode } from "react";
import { ViewStyle } from "react-native";

/**
 * Props for the CircleChart component
 */
export interface CircleChartProps {
  /**
   * Current value to display on the chart
   */
  value: number;

  /**
   * Maximum possible value (represents 100% of the circle)
   */
  maxValue: number;

  /**
   * Width of the circular stroke in pixels
   * @default 10
   */
  strokeWidth?: number;

  /**
   * Color of the progress arc
   * @default theme.primary.main
   */
  valueColor?: string;

  /**
   * Color of the background circle
   * @default theme.contrast[30]
   */
  backgroundColor?: string;

  /**
   * Content to display in the center of the circle
   */
  content?: ReactNode;

  /**
   * Additional style for the container
   */
  style?: ViewStyle;
}
