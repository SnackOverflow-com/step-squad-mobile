import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";
import Button from "../Button";

const SwitcherContainer = styled(View)`
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.card};
  padding: 4px;
  border-radius: 8px;
  flex-direction: row;
  gap: 8px;
`;

const SwitcherButton = styled(Button)<{ $isActive: boolean }>`
  flex: 1;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text} !important;
  background-color: ${({
    $isActive,
    theme,
  }: {
    $isActive: boolean;
    theme: DefaultTheme;
  }) => ($isActive ? theme.contrast[10] : "transparent")};
`;

export interface SwitcherOption {
  value: string;
  label: string;
}

interface SwitcherProps {
  options: SwitcherOption[];
  value: string;
  onChange: (value: string) => void;
}

const Switcher = ({ options, value, onChange }: SwitcherProps) => {
  return (
    <SwitcherContainer>
      {options.map((option) => (
        <SwitcherButton
          key={option.value}
          $isActive={value === option.value}
          variant="ghost"
          size="s"
          onPress={() => onChange(option.value)}
        >
          {option.label}
        </SwitcherButton>
      ))}
    </SwitcherContainer>
  );
};

export default Switcher;
