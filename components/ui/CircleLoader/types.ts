import { ReactNode } from "react";
import { ViewStyle } from "react-native";

/**
 * Props for the CircleLoader component
 */
export interface CircleLoaderProps {
  /**
   * Current progress value
   */
  progress: number;

  /**
   * Maximum value for the progress (100% completion)
   */
  maxValue: number;

  /**
   * Width of the circular stroke in pixels
   * @default 10
   */
  strokeWidth?: number;

  /**
   * Size of the circle loader in pixels (both width and height)
   * @default 120
   */
  size?: number;

  /**
   * Color of the progress arc
   * @default theme.primary.main
   */
  progressColor?: string;

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
