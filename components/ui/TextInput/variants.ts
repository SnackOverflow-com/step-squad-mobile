import { DefaultTheme } from "styled-components/native";
import { TextInputState } from "./index";

export interface StyledTextInputContainerProps {
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}

export interface StyledTextInputProps {
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}

// Define border colors for different states
export const textInputStates = ({
  theme,
  state,
}: {
  theme: DefaultTheme;
  state: TextInputState;
}): string => {
  switch (state) {
    case "default":
      return theme.neutral[30]; // Default border color
    case "hover":
      return theme.neutral[60]; // Hover border color
    case "focus":
      return theme.primary.main; // Focus border color
    case "filled":
      return theme.neutral[30]; // Filled border color
    case "error":
      return theme.error; // Error border color
    case "disabled":
      return theme.neutral[30]; // Disabled border color
    default:
      return theme.neutral[30];
  }
};

// Define label text colors for different states
export const labelStyles = ({
  theme,
  state,
  disabled,
}: {
  theme: DefaultTheme;
  state: TextInputState;
  disabled?: boolean;
}): string => {
  if (disabled) {
    return theme.neutral[50]; // Disabled label color
  }

  switch (state) {
    case "error":
      return theme.error; // Error label color
    case "focus":
      return theme.primary.main; // Focus label color
    default:
      return theme.neutral[100]; // Default, hover, filled label color
  }
};

// Define hint text colors for different states
export const hintTextStyles = ({
  theme,
  state,
  disabled,
}: {
  theme: DefaultTheme;
  state: TextInputState;
  disabled?: boolean;
}): string => {
  if (disabled) {
    return theme.neutral[50]; // Disabled hint text color
  }

  switch (state) {
    case "error":
      return theme.error; // Error hint text color
    default:
      return theme.neutral[70]; // Default, hover, focus, filled hint text color
  }
};
