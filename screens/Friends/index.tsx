import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { BaseText } from "@/components/ui";
import Header from "@/components/MainHeader";
import messages from "./messages";
import FriendItem from "./FriendItem";
import { useUser } from "@/hooks";
import InviteBanner from "./InviteBanner";
const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const FriendListContainer = styled(View)`
  gap: 8px;
`;

const FriendsScreen = () => {
  const { formatMessage } = useIntl();
  const { user } = useUser();

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />

        <InviteBanner />

        <BaseText size="m">You have 3,456 friends</BaseText>

        <FriendListContainer>
          <FriendItem user={user!} />
          <FriendItem user={user!} />
          <FriendItem user={user!} />
          <FriendItem user={user!} />
        </FriendListContainer>
      </Container>
    </SafeAreaWrapper>
  );
};

export default FriendsScreen;
