import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Header from "@/components/MainHeader";
import messages from "./messages";
import WaterIntakeSection from "./WaterIntakeSection";

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    gap: 16,
    flex: 1,
  },
})`
  flex: 1;
  padding: 16px;
`;

const WaterScreen = () => {
  const { formatMessage } = useIntl();

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />

        <WaterIntakeSection />

        {/* Additional content will be added by the user */}
      </Container>
    </SafeAreaWrapper>
  );
};

export default WaterScreen;
