import { BaseText } from "@/components/ui";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const ContentContainer = styled(View)`
  padding: 20px;
`;

const ExploreScreen = () => {
  return (
    <SafeAreaWrapper>
      <ContentContainer>
        <BaseText>Explore</BaseText>
      </ContentContainer>
    </SafeAreaWrapper>
  );
};

export default ExploreScreen;
