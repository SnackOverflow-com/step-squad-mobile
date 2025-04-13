import React, { Fragment, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { defineMessages, useIntl } from "react-intl";
import { DefaultTheme } from "styled-components";
import { SearchIcon, UserCheckIcon } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import InfoMessage from "@/components/InfoMessage";
import { Button, TextInput, useToast } from "@/components/ui";
import FriendItem from "./FriendItem";
import { useThemeContext } from "@/hooks";
import {
  FriendResponseDto,
  searchUsers,
  addFriend,
} from "@/services/api/friend";

const messages = defineMessages({
  searchPlaceholder: {
    id: "friends.addFriends.searchPlaceholder",
    defaultMessage: "Search friends..",
  },
  add: {
    id: "friends.addFriends.add",
    defaultMessage: "Add",
  },
  noResults: {
    id: "friends.addFriends.noResults",
    defaultMessage: "No users found",
  },
  searchTitle: {
    id: "friends.addFriends.searchTitle",
    defaultMessage: "Search friend",
  },
  searchContent: {
    id: "friends.addFriends.searchContent",
    defaultMessage: "Start typing to search for friends",
  },
});

const StyledSearchIcon = styled(SearchIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.contrast[80]};
  margin-right: 8px;
`;

const FriendListContainer = styled(View)`
  gap: 8px;
`;

const StyledUserCheckIcon = styled(UserCheckIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.success};
  margin-right: 8px;
`;

const AddFriends = () => {
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();
  const { theme } = useThemeContext();

  const { data: searchResults, isLoading } = useQuery<FriendResponseDto[]>({
    queryKey: ["friendSearch", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const addFriendMutation = useMutation({
    mutationFn: (userId: number) => addFriend(userId),
    onSuccess: () => {
      // Invalidate friends list query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success({
        title: "Success",
        description: "Friend added successfully",
      });
    },
    onError: (error) => {
      toast.error({
        title: "Error",
        description: "Failed to add friend",
      });
      console.error("Failed to add friend:", error);
    },
  });

  const handleAddFriend = (userId: number) => {
    addFriendMutation.mutate(userId);
  };

  const hasSearchResults = searchResults && searchResults.length > 0;
  const showEmptyState = !searchQuery;
  const showNoResults =
    searchQuery.length > 0 && !isLoading && !hasSearchResults;

  return (
    <Fragment>
      <TextInput
        placeholder={formatMessage(messages.searchPlaceholder)}
        leftIcon={<StyledSearchIcon />}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {showEmptyState && (
        <Fragment>
          <InfoMessage
            icon={<SearchIcon />}
            title={formatMessage(messages.searchTitle)}
            content={formatMessage(messages.searchContent)}
          />
        </Fragment>
      )}

      {showNoResults && (
        <InfoMessage
          icon={<SearchIcon />}
          title={formatMessage(messages.noResults)}
          content=""
        />
      )}

      {hasSearchResults && (
        <FriendListContainer>
          {searchResults.map((friend, index) => (
            <Fragment key={friend.id || index}>
              <FriendItem
                descriptionType="ageGender"
                user={friend}
                action={
                  !friend.isFriend ? (
                    <Button
                      size="s"
                      variant="outline"
                      onPress={() => handleAddFriend(friend.id)}
                      disabled={addFriendMutation.isPending}
                    >
                      {addFriendMutation.isPending ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.primary.main}
                        />
                      ) : (
                        formatMessage(messages.add)
                      )}
                    </Button>
                  ) : (
                    <StyledUserCheckIcon />
                  )
                }
              />
            </Fragment>
          ))}
        </FriendListContainer>
      )}
    </Fragment>
  );
};

export default AddFriends;
