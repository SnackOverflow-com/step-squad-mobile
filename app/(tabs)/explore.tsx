import React from "react";
import { View, Alert, Text } from "react-native";
import styled from "styled-components/native";

const ContentContainer = styled(View)`
  padding: 20px;
`;

const EmptyHeaderView = styled(View)`
  width: 100%;
  height: 50px;
`;

const ExploreScreen = () => {
  return (
    <ContentContainer>
      <Text>Explore</Text>
    </ContentContainer>
  );
};

export default ExploreScreen;
