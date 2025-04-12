import InfoMessage from "@/components/InfoMessage";
import { Button, TextInput } from "@/components/ui";
import { SearchIcon } from "lucide-react-native";
import React, { Fragment } from "react";
import { defineMessages, useIntl } from "react-intl";
import { DefaultTheme } from "styled-components";
import styled from "styled-components/native";
import FriendItem from "./FriendItem";
import { useUser } from "@/hooks";

const messages = defineMessages({
  searchPlaceholder: {
    id: "friends.addFriends.searchPlaceholder",
    defaultMessage: "Search friends..",
  },
  add: {
    id: "friends.addFriends.add",
    defaultMessage: "Add",
  },
});

const StyledSearchIcon = styled(SearchIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.contrast[80]};
  margin-right: 8px;
`;

const AddFriends = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();

  const searchQuery = true;

  return (
    <Fragment>
      <TextInput
        placeholder={formatMessage(messages.searchPlaceholder)}
        leftIcon={<StyledSearchIcon />}
      />

      {!searchQuery && (
        <Fragment>
          <InfoMessage
            icon={<SearchIcon />}
            title="Search friend"
            content="Start typing to search for friends"
          />
        </Fragment>
      )}

      {[...Array(3)].map((_, index) => (
        <Fragment key={index}>
          <FriendItem
            user={user!}
            action={
              <Button size="s" variant="outline">
                {formatMessage(messages.add)}
              </Button>
            }
          />
        </Fragment>
      ))}
    </Fragment>
  );
};

export default AddFriends;
