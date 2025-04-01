import { BaseText } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

const Container = styled(View)`
  width: 100%;
  border-radius: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.card};
  padding: 20px;
`;

const OverviewSection = () => {
  return (
    <Container>
      <BaseText size="xs">Stats</BaseText>
    </Container>
  );
};

export default OverviewSection;
