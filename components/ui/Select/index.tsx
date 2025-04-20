import React from "react";
import { View, Pressable } from "react-native";
import styled from "styled-components/native";

import TextInput from "../TextInput";
import Dropdown from "../Dropdown";
import { TextInputProps } from "../TextInput/types";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const SelectContainer = styled(View)`
  width: 100%;
`;

const OverlayTouchable = styled(Pressable)`
  width: 100%;
`;

const Select = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  error,
  ...textInputProps
}: SelectProps) => {
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <SelectContainer>
      <Dropdown position="bottom" isFullWidth={true}>
        <Dropdown.Trigger style={{ width: "100%" }}>
          <OverlayTouchable>
            <View style={{ pointerEvents: "none" }}>
              <TextInput
                value={displayText}
                style={{ width: "100%" }}
                label={label}
                error={error}
                editable={false}
                pointerEvents="none"
                {...textInputProps}
              />
            </View>
          </OverlayTouchable>
        </Dropdown.Trigger>

        {options.map((option) => (
          <Dropdown.Item
            key={option.value}
            label={option.label}
            onPress={() => onValueChange(option.value)}
          />
        ))}
      </Dropdown>
    </SelectContainer>
  );
};

export default Select;
