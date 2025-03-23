import { css } from "styled-components";
import { DefaultTheme } from "styled-components/native";

import { TextInputState } from "./types";

// Define border colors for different states
export const textInputStates = ({ state }: { state: TextInputState }) => {
  switch (state) {
    case "default":
      return css`
        background-color: ${({ theme }) => theme.background};
        border-color: ${({ theme }) => theme.contrast[40]};
      `;
    case "focus":
      return css`
        background-color: ${({ theme }) => theme.background};
        border-color: ${({ theme }) => theme.primary.main};
      `;
    case "filled":
      return css`
        background-color: ${({ theme }) => theme.background};
        border-color: ${({ theme }) => theme.contrast[40]};
      `;
    case "error":
      return css`
        background-color: ${({ theme }) => theme.background};
        border-color: ${({ theme }) => theme.error.main};
      `;
    case "disabled":
      return css`
        background-color: ${({ theme }) => theme.contrast[20]};
        border-color: ${({ theme }) => theme.contrast[40]};
      `;
    default:
      return css`
        border-color: ${({ theme }) => theme.contrast[30]};
      `;
  }
};

// Define hint text colors for different states
export const hintTextStyles = (state: TextInputState, disabled?: boolean) => {
  if (disabled) {
    return css`
      color: ${({ theme }: { theme: DefaultTheme }) => theme.contrast[50]};
    `;
  }

  switch (state) {
    case "error":
      return css`
        color: ${({ theme }: { theme: DefaultTheme }) => theme.error.main};
      `;
    default:
      return css`
        color: ${({ theme }: { theme: DefaultTheme }) => theme.contrast[70]};
      `;
  }
};
