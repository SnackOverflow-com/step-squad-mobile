import { PressableProps } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "s" | "m" | "l";

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  children: React.ReactNode;
}
