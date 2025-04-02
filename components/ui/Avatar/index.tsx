import React from "react";
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

const Avatar = ({ name, isOnline }: { name: string; isOnline?: boolean }) => {
  return (
    <Container>
      <StyledBaseText size="s" fontWeight="700">
        {name.charAt(0)}
      </StyledBaseText>
      {isOnline && <OnlineIndicator />}
    </Container>
  );
};

export default Avatar;
