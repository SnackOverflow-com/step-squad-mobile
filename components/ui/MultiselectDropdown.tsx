import React from "react";
import { Animated, Modal, Pressable, View } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import BaseText from "./BaseText";
import { useThemeContext } from "@/hooks";

interface MultiSelectDropdownItem {
  label: string;
  value: any;
}

interface MultiSelectDropdownProps {
  label?: string;
  value?: string;
  items: MultiSelectDropdownItem[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MultiSelectDropdownContainer = styled(View)`
  gap: 4px;
`;

const MultiSelectDropdownButton = styled(AnimatedPressable)`
  flex-direction: row;
  align-items: center;
  justify-content: start;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.contrast[40] || "rgb(166, 169, 172)"};
  padding: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.background || "#2a2a2a"};
`;

const SelectedText = styled(BaseText)<{ hasValue: boolean }>`
  color: ${({ hasValue, theme }: { hasValue: boolean; theme: DefaultTheme }) =>
    hasValue
      ? theme.text || "#FFFFFF"
      : theme.contrast[60] || "rgb(166, 169, 172)"};
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  text-align: left;
`;

const ModalOverlay = styled(Pressable)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(View)`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.background || "#2a2a2a"};
  border-radius: 12px;
  width: 80%;
  max-height: 70%;
`;

const OptionItem = styled(Pressable)<{ isLast: boolean }>`
  padding: 16px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: rgb(166, 169, 172);
`;

const OptionText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text || "#FFFFFF"};
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  text-align: center;
`;

const ErrorText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.error.main};
  margin-top: 4px;
`;

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  value,
  items,
  onValueChange,
  placeholder,
  error,
}) => {
  const { theme } = useThemeContext();

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };

  const selectedItem = items?.find((item) => item.value === value);
  const displayText = selectedItem?.label || placeholder || "Select an option";

  return (
    <MultiSelectDropdownContainer>
      {label && <BaseText color={theme.text}>{label}</BaseText>}
      <MultiSelectDropdownButton
        theme={theme}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => setIsModalVisible(true)}
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <SelectedText hasValue={!!selectedItem}>{displayText}</SelectedText>
      </MultiSelectDropdownButton>

      {error && <ErrorText size="xs">{error}</ErrorText>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ModalOverlay onPress={() => setIsModalVisible(false)}>
          <ModalContent theme={theme}>
            {items?.map((item, index) => (
              <OptionItem
                key={item.value}
                isLast={index === items.length - 1}
                onPress={() => {
                  onValueChange(item.value);
                  setIsModalVisible(false);
                }}
              >
                <OptionText>{item.label}</OptionText>
              </OptionItem>
            ))}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </MultiSelectDropdownContainer>
  );
};

export default MultiSelectDropdown;
