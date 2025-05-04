import React, { Fragment, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
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
import messages from "./messages";

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

const InfoMessageIcon = styled(SearchIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.info.main};
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
    networkMode: "always",
  });

  const addFriendMutation = useMutation({
    mutationFn: (friendId: number) => addFriend(friendId),
    onSuccess: () => {
      // Invalidate queries - this will automatically trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      // Also invalidate the search results to update the UI
      queryClient.invalidateQueries({ queryKey: ["friendSearch"] });

      toast.success({
        title: formatMessage(messages.successAdd),
        description: formatMessage(messages.successAddDescription),
      });
    },
    onError: (error) => {
      toast.error({
        title: formatMessage(messages.errorAdd),
        description: formatMessage(messages.errorAddDescription),
      });
      console.error("Failed to add friend:", error);
    },
  });

  const handleAddFriend = (friendId: number) => {
    if (addFriendMutation.isPending) return;
    addFriendMutation.mutate(friendId);
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
            icon={<InfoMessageIcon />}
            title={formatMessage(messages.searchTitle)}
            content={formatMessage(messages.searchContent)}
          />
        </Fragment>
      )}

      {showNoResults && (
        <InfoMessage
          icon={<InfoMessageIcon />}
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
