import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Pressable, View } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";
import BaseText from "../BaseText";

const Container = styled(Pressable)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.info.surface};
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.info.focus};
`;

const StyledBaseText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.info.main};
`;

const OnlineIndicator = styled(View)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.success};
`;

interface AvatarProps {
  name: string;
  isOnline?: boolean;
  onPress?: () => void;
}

export interface AvatarRef {
  measurePosition: () => Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>;
}

const Avatar = forwardRef<AvatarRef, AvatarProps>(
  ({ name, isOnline, onPress }, ref) => {
    const containerRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      measurePosition: () => {
        return new Promise((resolve) => {
          if (containerRef.current) {
            containerRef.current.measure(
              (x, y, width, height, pageX, pageY) => {
                resolve({
                  x: pageX,
                  y: pageY,
                  width,
                  height,
                });
              }
            );
          } else {
            resolve(null);
          }
        });
      },
    }));

    return (
      <Container ref={containerRef} onPress={onPress}>
        <StyledBaseText size="s" fontWeight="700">
          {name.charAt(0)}
        </StyledBaseText>
        {isOnline && <OnlineIndicator />}
      </Container>
    );
  }
);

export default Avatar;
