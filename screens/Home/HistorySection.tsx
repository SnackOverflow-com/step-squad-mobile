import { Button } from "@/components/ui";
import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import { css, DefaultTheme } from "styled-components";
import styled from "styled-components/native";

const Container = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: 4,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
})`
  flex-direction: row;
`;

const HistoryButton = styled(Button)<{ $isSelected: boolean }>`
  height: auto;
  align-self: flex-start;
  padding: 4px 8px;

  ${({ $isSelected, theme }: { $isSelected: boolean; theme: DefaultTheme }) =>
    $isSelected &&
    css`
      border: 1px solid ${theme.primary.main};
    `}
`;

const HistorySection = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View>
      <Container
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}
      >
        <HistoryButton variant="outline" size="s">
          🥲 Mon 13
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          😍 Mon 14
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          🥶 Mon 15
        </HistoryButton>

        <HistoryButton variant="outline" size="s">
          🥳 Mon 16
        </HistoryButton>

        <HistoryButton $isSelected={true} variant="outline" size="s">
          🥳 Mon 17
        </HistoryButton>
      </Container>
    </View>
  );
};

export default HistorySection;
