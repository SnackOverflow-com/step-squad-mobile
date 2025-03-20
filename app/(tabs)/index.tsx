import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

import { DefaultTheme } from "styled-components";
import { BaseText } from "@/components/ui/BaseText";

// Local styled components
const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

// Example of custom styled BaseText
const ErrorText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.error};
`;

const BrandText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.main};
`;

const Separator = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.neutral[30]};
`;

const HomeScreen = () => {
  return (
    <Container>
      <BrandText weight="700" size="xl">
        Welcome to StepSquad
      </BrandText>

      <Separator />

      <BaseText weight="600" size="l">
        Font Demo and random bs components
      </BaseText>

      <BaseText weight="400">This is ManropeRegular font (weight 400)</BaseText>

      <BaseText weight="600">
        This is ManropeSemiBold font (weight 600)
      </BaseText>

      <BaseText weight="700">This is ManropeBold font (weight 700)</BaseText>

      <ErrorText>This is an error message with custom styling</ErrorText>
    </Container>
  );
};

export default HomeScreen;
