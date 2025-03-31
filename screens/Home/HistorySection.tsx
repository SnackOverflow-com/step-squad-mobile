import { Button } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
const Container = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
  gap: 8px;
`;

const HistoryButton = styled(Button)`
  height: auto;
  align-self: flex-start;
  padding: 4px 8px;
`;

const HistorySection = () => {
  return (
    <View>
      <Container>
        <HistoryButton variant="outline" size="s">
          🤣 Mon 13
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          😍 Mon 14
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          😜 Mon 15
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          🥳 Mon 16
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          🥳 Mon 17
        </HistoryButton>
      </Container>
    </View>
  );
};

export default HistorySection;
