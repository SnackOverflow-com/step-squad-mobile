import React, {
  ReactNode,
  useRef,
  useState,
  createContext,
  useContext,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import {
  Pressable,
  View,
  Modal,
  Dimensions,
  findNodeHandle,
  UIManager,
  StatusBar,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";

import BaseText from "../BaseText";
import { useThemeContext } from "@/hooks";

const DropdownContainer = styled(View)`
  min-width: 180px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.background};
  border: 1px solid
    ${({ theme }: { theme: DefaultTheme }) => theme.contrast[20]};
  display: flex;
  gap: 4px;
  padding: 8px;
  border-radius: 16px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  z-index: 999;
  overflow: hidden;
`;

const DropdownItemContainer = styled(Pressable)`
  padding: 8px;
  border-radius: 8px;
  /* background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.neutral[50]}; */
`;

const DropdownItemText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const DividerLine = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.contrast[20]};
`;

// Create a context to share state between compound components
interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  setAnchorPosition: (
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null
  ) => void;
  anchorPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  position: "top" | "bottom" | "left" | "right";
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
};

// Item component
interface ItemProps {
  children?: ReactNode;
  onPress?: () => void;
  label?: string;
  icon?: ReactNode;
  isDropdownItem?: boolean; // Internal prop to identify items
}

const Item = ({ children, onPress, label, icon }: ItemProps) => {
  const { close } = useDropdownContext();
  const [isPressed, setIsPressed] = useState(false);
  const { theme } = useThemeContext();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    close();
  };

  // Check if has children to determine rendering approach
  const hasCustomContent = children !== undefined && children !== null;

  // Get appropriate colors from theme
  const rippleColor = theme.contrast[20];
  const pressedColor = theme.contrast[10];

  return (
    <DropdownItemContainer
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      android_ripple={{
        color: rippleColor,
        borderless: false,
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: isPressed ? pressedColor : "transparent",
      }}
    >
      {icon}

      {/* Render based on what's provided */}
      {hasCustomContent
        ? // Custom content mode
          children
        : // Standard label mode
          label && <DropdownItemText>{label}</DropdownItemText>}
    </DropdownItemContainer>
  );
};

// Set a special property on the Item component to help identify it
Item.isDropdownItem = true;

// Divider component
interface DividerProps {
  margin?: number;
}

const Divider = ({ margin = 4 }: DividerProps) => {
  return (
    <View style={{ paddingVertical: margin }}>
      <DividerLine />
    </View>
  );
};

// Set a special property on the Divider component to help identify it
Divider.isDropdownItem = true;

// Main Dropdown component
interface DropdownProps {
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  initialState?: boolean;
}

const Dropdown = ({
  children,
  position = "bottom",
  initialState = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [anchorPosition, setAnchorPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const value = {
    isOpen,
    toggle,
    close,
    setAnchorPosition,
    anchorPosition,
    position,
  };

  // Find and render DropdownItems separately from other children
  const items: React.ReactNode[] = [];
  let otherContent: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      // Check for the special property to identify dropdown items
      if (child.type && (child.type as any).isDropdownItem) {
        items.push(child);
      } else {
        otherContent.push(child);
      }
    }
  });

  return (
    <DropdownContext.Provider value={value}>
      <View style={{ position: "relative" }}>
        {otherContent}

        <DropdownMenu items={items} />
      </View>
    </DropdownContext.Provider>
  );
};

// Get status bar height for positioning adjustments
const getStatusBarHeight = () => {
  if (Platform.OS === "ios") {
    // iOS status bar height can vary by device
    return StatusBar.currentHeight || 20;
  }

  // Android status bar height
  return StatusBar.currentHeight || 0;
};

// Dropdown Menu component (internal)
interface DropdownMenuProps {
  items: React.ReactNode[];
}

const DropdownMenu = ({ items }: DropdownMenuProps) => {
  const { isOpen, close, anchorPosition, position } = useDropdownContext();
  const screenWidth = Dimensions.get("window").width;
  const defaultPosition = { top: 100, right: 20 };
  const statusBarHeight = getStatusBarHeight();

  // Calculate position based on anchor
  const getPositionStyle = () => {
    if (!anchorPosition) return defaultPosition;

    const { x, y, width, height } = anchorPosition;

    // Adjust Y position to account for status bar
    const adjustedY = y - statusBarHeight;

    // Calculate position based on desired alignment
    switch (position) {
      case "bottom":
        return {
          position: "absolute" as const,
          top: adjustedY + height + 8,
          right: screenWidth - (x + width),
        };
      case "top":
        return {
          position: "absolute" as const,
          bottom: adjustedY - 8,
          right: screenWidth - (x + width),
        };
      case "left":
        return {
          position: "absolute" as const,
          top: adjustedY,
          right: screenWidth - x + 8,
        };
      case "right":
        return {
          position: "absolute" as const,
          top: adjustedY,
          left: x + width + 8,
        };
      default:
        return defaultPosition;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={close}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
        onPress={close}
      >
        <DropdownContainer style={getPositionStyle()}>
          {items}
        </DropdownContainer>
      </Pressable>
    </Modal>
  );
};

// Trigger component
interface TriggerProps {
  children: ReactNode;
}

const Trigger = ({ children }: TriggerProps) => {
  const { toggle, setAnchorPosition } = useDropdownContext();
  const triggerRef = useRef<View>(null);

  const measureNode = (node: any) => {
    return new Promise<{
      x: number;
      y: number;
      width: number;
      height: number;
    } | null>((resolve) => {
      if (!node) {
        resolve(null);
        return;
      }

      const handle = findNodeHandle(node);
      if (!handle) {
        resolve(null);
        return;
      }

      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        resolve({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    });
  };

  const handlePress = async () => {
    // Get the direct DOM node, not the React component
    const position = await measureNode(triggerRef.current);

    if (position) {
      setAnchorPosition(position);
    }

    toggle();
  };

  // Create a wrapper to capture ref and handle press
  const wrapChild = (child: React.ReactElement) => {
    return (
      <View
        ref={triggerRef}
        onLayout={() => {}} // Empty onLayout to ensure the view is measured
        style={{ alignSelf: "flex-start" }} // Don't stretch the view
      >
        {cloneElement(child, {
          ...child.props,
          onPress: handlePress,
        })}
      </View>
    );
  };

  // Clone child with ref and onPress
  const child = Children.only(children);
  if (isValidElement(child)) {
    return wrapChild(child);
  }

  // Fallback if not a valid element
  return (
    <Pressable onPress={handlePress}>
      <View ref={triggerRef} onLayout={() => {}}>
        {children}
      </View>
    </Pressable>
  );
};

// Set a special property on the Trigger component
Trigger.isDropdownTrigger = true;

// Attach subcomponents to the main component
Dropdown.Item = Item;
Dropdown.Trigger = Trigger;
Dropdown.Divider = Divider;

export default Dropdown;
