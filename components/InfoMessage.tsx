import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { BaseText } from "./ui";
import { DefaultTheme } from "styled-components";

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-bottom: 8px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.info.surface};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.info.main};
`;
const InfoMessage = ({
  icon,
  title,
  content,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  action?: React.ReactNode;
}) => {
  return (
    <Container style={{ flex: 1 }}>
      <IconContainer>{icon}</IconContainer>

      <BaseText size="xl">{title}</BaseText>

      <BaseText size="s" color={70} style={{ textAlign: "center" }}>
        {content}
      </BaseText>
      {action}
    </Container>
  );
};

export default InfoMessage;
