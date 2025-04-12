import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { BaseText } from "@/components/ui";
import Header from "@/components/MainHeader";
import messages from "./messages";
const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const FriendsScreen = () => {
  const { formatMessage } = useIntl();

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />
        <BaseText size="m">Friends list will be displayed here</BaseText>
      </Container>
    </SafeAreaWrapper>
  );
};

export default FriendsScreen;
