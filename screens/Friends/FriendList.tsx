import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  UserRoundSearch,
} from "lucide-react-native";
import { useIntl } from "react-intl";

import { BaseText, Button, Dropdown } from "@/components/ui";
import InfoMessage from "@/components/InfoMessage";
import { useThemeContext, useUser } from "@/hooks";
import FriendItem from "./FriendItem";
import messages from "./messages";

const Container = styled(View)`
  flex: 1;
  gap: 4px;
`;

const FriendListContainer = styled(View)`
  gap: 8px;
  padding-bottom: 100px;
`;

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FriendList = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { theme } = useThemeContext();

  const hasNoFriends = false;

  if (hasNoFriends) {
    return (
      <EmptyStateContainer style={{ flex: 1 }}>
        <InfoMessage
          icon={<UserRoundSearch />}
          title="No friends"
          content="Add friends to your list"
        />
      </EmptyStateContainer>
    );
  }

  return (
    <Container>
      <BaseText size="s">You have 3,456 friends</BaseText>

      <FriendListContainer>
        {[...Array(20)].map((_, index) => (
          <FriendItem
            descriptionType="steps"
            key={index}
            user={user!}
            action={
              <Dropdown position="bottom">
                <Dropdown.Trigger>
                  <Button variant="ghost" size="s">
                    <EllipsisVerticalIcon color={theme.text} />
                  </Button>
                </Dropdown.Trigger>

                <Dropdown.Item
                  label={formatMessage(messages.removeFriend)}
                  icon={<TrashIcon />}
                  onPress={() => {
                    /* TODO: Implement remove friend */
                  }}
                />
              </Dropdown>
            }
          />
        ))}
      </FriendListContainer>
    </Container>
  );
};

export default FriendList;
