import React, { useState, useRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
  Animated,
  Pressable,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import {
  StyledTextInputContainerProps,
  StyledTextInputProps,
  textInputStates,
  labelStyles,
  hintTextStyles,
} from "./variants";

// Define text input types
export type TextInputState =
  | "default"
  | "hover"
  | "focus"
  | "filled"
  | "error"
  | "disabled";
export type TextInputType = "normal" | "password" | "number" | "email";

// Define text input props
export interface TextInputProps extends Omit<RNTextInputProps, "disabled"> {
  label?: string;
  helperText?: string;
  type?: TextInputType;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDisabled?: boolean;
  disabled?: boolean;
}

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

const Container = styled(View)`
  margin-bottom: 16px;
  width: 100%;
`;

const InputContainer = styled(View)<StyledTextInputContainerProps>`
  border-width: 1px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  background-color: ${({
    theme,
    state,
    disabled,
  }: {
    theme: DefaultTheme;
    state: TextInputState;
    disabled?: boolean;
  }) =>
    disabled
      ? theme.neutral[20]
      : state === "error"
        ? "#FFECEC"
        : theme.neutral[10]};
  border-color: ${({
    theme,
    state,
  }: {
    theme: DefaultTheme;
    state: TextInputState;
  }) => textInputStates({ theme, state })};
`;

const StyledTextInput = styled(AnimatedTextInput)<StyledTextInputProps>`
  flex: 1;
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.fontFamily["400"]};
  font-size: ${({ theme }: { theme: DefaultTheme }) => `${theme.fontSize.m}px`};
  color: ${({
    theme,
    disabled,
  }: {
    theme: DefaultTheme;
    disabled?: boolean;
  }) => (disabled ? theme.neutral[50] : theme.neutral[100])};
  padding: 0;
`;

const Label = styled(Text)<{
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}>`
  margin-bottom: 6px;
  color: ${(props: {
    state: TextInputState;
    disabled?: boolean;
    theme: DefaultTheme;
  }) => labelStyles(props)};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.fontFamily["600"]};
  font-size: ${({ theme }: { theme: DefaultTheme }) => `${theme.fontSize.s}px`};
`;

const HintText = styled(Text)<{
  state: TextInputState;
  disabled?: boolean;
  theme: DefaultTheme;
}>`
  margin-top: 6px;
  color: ${(props: {
    state: TextInputState;
    disabled?: boolean;
    theme: DefaultTheme;
  }) => hintTextStyles(props)};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.fontFamily["400"]};
  font-size: ${({ theme }: { theme: DefaultTheme }) => `${theme.fontSize.s}px`};
`;

const IconContainer = styled(View)`
  margin: 4px 0;
`;

const TextInput = ({
  label,
  helperText,
  type = "normal",
  error,
  leftIcon,
  rightIcon,
  isDisabled = false,
  disabled,
  style,
  placeholder = "Placeholder",
  value,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) => {
  // Use either isDisabled prop or standard disabled prop
  const isInputDisabled = isDisabled || disabled;

  // Refs
  const inputRef = useRef<RNTextInput>(null);

  // State for tracking input state
  const [inputState, setInputState] = useState<TextInputState>(
    isInputDisabled
      ? "disabled"
      : error
        ? "error"
        : value
          ? "filled"
          : "default"
  );

  // Handle focus
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!isInputDisabled) {
      setInputState("focus");
      onFocus && onFocus(e);
    }
  };

  // Handle blur
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!isInputDisabled) {
      setInputState(error ? "error" : value ? "filled" : "default");
      onBlur && onBlur(e);
    }
  };

  // Handle container press to focus input
  const handleContainerPress = () => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Container>
      {label && (
        <Label state={inputState} disabled={isInputDisabled}>
          {label}
        </Label>
      )}

      <Pressable onPress={handleContainerPress}>
        <InputContainer state={inputState} disabled={isInputDisabled}>
          {leftIcon && <IconContainer>{leftIcon}</IconContainer>}

          <StyledTextInput
            ref={inputRef}
            state={inputState}
            disabled={isInputDisabled}
            editable={!isInputDisabled}
            placeholder={placeholder}
            placeholderTextColor={isInputDisabled ? "#A6A9AC" : "#C3C7CA"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            secureTextEntry={type === "password"}
            keyboardType={
              type === "number"
                ? "numeric"
                : type === "email"
                  ? "email-address"
                  : "default"
            }
            style={style}
            {...props}
          />

          {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
        </InputContainer>
      </Pressable>

      {(helperText || error) && (
        <HintText
          state={error ? "error" : inputState}
          disabled={isInputDisabled}
        >
          {error || helperText}
        </HintText>
      )}
    </Container>
  );
};

export default TextInput;
