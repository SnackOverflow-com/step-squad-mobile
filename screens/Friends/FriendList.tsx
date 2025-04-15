import React from "react";
import { View, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  UserRoundSearch,
} from "lucide-react-native";
import { useIntl } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { BaseText, Button, Dropdown, useToast } from "@/components/ui";
import InfoMessage from "@/components/InfoMessage";
import { useThemeContext } from "@/hooks";
import FriendItem from "./FriendItem";
import messages from "./messages";
import {
  FriendWithActivityResponseDto,
  getFriendsWithActivities,
  removeFriend,
} from "@/services/api/friend";
import { DefaultTheme } from "styled-components";

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

const StyledTrashIcon = styled(TrashIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const FriendList = () => {
  const { formatMessage } = useIntl();
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch friends with activities
  const {
    data: friends,
    isLoading,
    isError,
  } = useQuery<FriendWithActivityResponseDto[]>({
    queryKey: ["friends"],
    queryFn: getFriendsWithActivities,
  });

  // Mutation for removing a friend
  const removeFriendMutation = useMutation({
    mutationFn: (friendId: number) => removeFriend(friendId),
    onSuccess: () => {
      // Invalidate the query cache - this will automatically trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendSearch"] });

      toast.success({
        title: formatMessage(messages.successRemove),
        description: formatMessage(messages.successRemoveDescription),
      });
    },
    onError: (error) => {
      toast.error({
        title: formatMessage(messages.errorRemove),
        description: formatMessage(messages.errorRemoveDescription),
      });
      console.error("Failed to remove friend:", error);
    },
  });

  const handleRemoveFriend = (friendId: number) => {
    if (removeFriendMutation.isPending) return;
    removeFriendMutation.mutate(friendId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <EmptyStateContainer>
        <ActivityIndicator size="large" color={theme.primary.main} />
      </EmptyStateContainer>
    );
  }

  // Show error state
  if (isError) {
    return (
      <EmptyStateContainer>
        <InfoMessage
          icon={<TrashIcon />}
          title={formatMessage(messages.errorTitle)}
          content={formatMessage(messages.errorContent)}
        />
      </EmptyStateContainer>
    );
  }

  const hasNoFriends = !friends || friends.length === 0;

  if (hasNoFriends) {
    return (
      <EmptyStateContainer>
        <InfoMessage
          icon={<UserRoundSearch />}
          title={formatMessage(messages.empty)}
          content={formatMessage(messages.emptyContent)}
        />
      </EmptyStateContainer>
    );
  }

  return (
    <Container>
      <BaseText size="s">
        {friends.length === 1
          ? formatMessage(messages.friendCountSingular)
          : formatMessage(messages.friendCountPlural, {
              count: friends.length,
            })}
      </BaseText>

      <FriendListContainer>
        {friends.map((friend) => (
          <FriendItem
            descriptionType="steps"
            key={friend.id}
            user={friend}
            action={
              <Dropdown position="bottom">
                <Dropdown.Trigger>
                  <Button variant="ghost" size="s">
                    <EllipsisVerticalIcon color={theme.text} />
                  </Button>
                </Dropdown.Trigger>

                <Dropdown.Item
                  label={formatMessage(messages.removeFriend)}
                  icon={<StyledTrashIcon />}
                  onPress={() => handleRemoveFriend(friend.id)}
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
