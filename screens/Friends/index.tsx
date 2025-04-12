import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { Switcher, SwitcherOption } from "@/components/ui";
import Header from "@/components/MainHeader";
import messages from "./messages";
import InviteBanner from "./InviteBanner";
import FriendList from "./FriendList";
import AddFriends from "./AddFriends";

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    gap: 16,
    flex: 1,
  },
})`
  flex: 1;
  padding: 16px;
`;

const FriendsScreen = () => {
  const { formatMessage } = useIntl();
  const [selectedTab, setSelectedTab] = useState<string>("friends");

  const tabOptions: SwitcherOption[] = [
    { value: "friends", label: "My friends" },
    { value: "addFriends", label: "Add friends" },
  ];

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />

        <InviteBanner />

        <Switcher
          options={tabOptions}
          value={selectedTab}
          onChange={setSelectedTab}
        />

        {selectedTab === "friends" && <FriendList />}
        {selectedTab === "addFriends" && <AddFriends />}
      </Container>
    </SafeAreaWrapper>
  );
};

export default FriendsScreen;
