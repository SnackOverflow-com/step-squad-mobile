import React, { createContext, useContext, useRef, ReactNode } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";

// Context type
interface ConfettiContextType {
  playConfetti: () => void;
}

// Create context with a default value
const ConfettiContext = createContext<ConfettiContextType>({
  playConfetti: () => {}, // Default empty function
});

// Styled components
const LottieContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`;

// Provider props type
interface ConfettiProviderProps {
  children: ReactNode;
}

/**
 * ConfettiProvider - Wrap your app with this to enable confetti animations
 */
export const ConfettiProvider: React.FC<ConfettiProviderProps> = ({
  children,
}) => {
  const confettiRef = useRef<LottieView>(null);

  const playConfetti = () => {
    confettiRef.current?.play(0);
  };

  // Provide the actual function to the context
  const contextValue = {
    playConfetti,
  };

  return (
    <ConfettiContext.Provider value={contextValue}>
      {children}
      <LottieContainer as={View} pointerEvents="none">
        <LottieView
          ref={confettiRef}
          source={require("../assets/confetti.json")}
          autoPlay={false}
          loop={false}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </LottieContainer>
    </ConfettiContext.Provider>
  );
};

/**
 * useConfetti - Hook to trigger confetti animation from anywhere in the app
 * @returns {Object} { playConfetti } - Function to trigger the confetti animation
 */
export const useConfetti = (): ConfettiContextType => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error("useConfetti must be used within a ConfettiProvider");
  }
  return context;
};
