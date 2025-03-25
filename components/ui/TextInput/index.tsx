import React, { useState, useRef, useEffect } from "react";
import {
  TextInput as RNTextInput,
  View,
  Animated,
  Pressable,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

import { textInputStates, hintTextStyles } from "./variants";
import {
  TextInputState,
  TextInputProps,
  StyledTextInputContainerProps,
  StyledTextInputProps,
} from "./types";
import BaseText from "../BaseText";
import { css } from "styled-components";

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

const Container = styled(View)`
  width: 100%;
`;

const InputContainer = styled(View)<StyledTextInputContainerProps>`
  border-width: 1px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  height: 56px;

  ${({ state }: { state: TextInputState }) => textInputStates({ state })};
`;

const StyledTextInput = styled(AnimatedTextInput)<StyledTextInputProps>`
  flex: 1;
  padding: 0;
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.m};
  line-height: ${({ theme }: { theme: DefaultTheme }) => theme.lineHeight.m};

  ${({ disabled }: { disabled?: boolean }) =>
    disabled
      ? css`
          color: ${({ theme }: { theme: DefaultTheme }) => theme.contrast[60]};
        `
      : css`
          color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
        `}
`;

const Label = styled(BaseText)`
  margin-bottom: 6px;
`;

const HintText = styled(BaseText)<{
  state: TextInputState;
  disabled?: boolean;
}>`
  margin-top: 6px;

  ${({ state, disabled }: { state: TextInputState; disabled?: boolean }) =>
    hintTextStyles(state, disabled)}
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
  placeholder,
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

  // Effect to handle keyboard hide event
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

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

  // Handle outside press to dismiss keyboard and blur input
  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <Container>
        {label && (
          <Label
            state={inputState}
            fontWeight="600"
            size="s"
            disabled={isInputDisabled}
          >
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
            size="xs"
            state={error ? "error" : inputState}
            disabled={isInputDisabled}
          >
            {error || helperText}
          </HintText>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default TextInput;
