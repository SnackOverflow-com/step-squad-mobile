import React from "react";
import { View, Image, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
import { useQuery } from "@tanstack/react-query";

import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";
import { getOrdinalSuffix } from "@/services/utils/string";
import messages from "./messages";
import { BaseText } from "@/components/ui";
import { Footprints, Trophy, UserRoundSearch } from "lucide-react-native";
import { DefaultTheme } from "styled-components";
import FriendItem from "../Friends/FriendItem";
import { useThemeContext, useUser } from "@/hooks";
import {
  DARK_MODE_GRADIENTS,
  LIGHT_MODE_GRADIENTS,
  POSITION_IMAGES,
} from "./constants";
import {
  getLeaderboard,
  LeaderboardEntryDto,
} from "@/services/api/leaderboard";
import InfoMessage from "@/components/InfoMessage";
import { Gender } from "@/types/user/gender";

const Container = styled(View)`
  flex: 1;
  gap: 4px;
`;

const PositionWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StyledTrophyIcon = styled(Trophy)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const StepsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StyledFootprintsIcon = styled(Footprints)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const ListContainer = styled(View)`
  gap: 8px;
  padding-bottom: 100px;
`;

const PositionImage = styled(Image)`
  width: 32px;
  height: 32px;
`;

const PositionText = styled(BaseText)`
  margin-right: 8px;
`;

const ActionContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const YouIndicator = styled(BaseText)`
  font-weight: 500;
`;

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

interface LeaderboardListProps {
  type: LeaderboardType;
}

const LeaderboardList = ({ type }: LeaderboardListProps) => {
  const { formatMessage } = useIntl();
  const { user } = useUser();
  const { theme, themeMode } = useThemeContext();

  // Fetch leaderboard data
  const {
    data: leaderboard,
    isLoading,
    isError,
  } = useQuery<LeaderboardEntryDto[]>({
    queryKey: ["leaderboard", type],
    queryFn: () => getLeaderboard(type),
  });

  // Select gradients based on theme
  const POSITION_GRADIENTS =
    themeMode === "dark" ? DARK_MODE_GRADIENTS : LIGHT_MODE_GRADIENTS;

  const getPositionIndicator = (position: number, isCurrentUser: boolean) => {
    let positionIndicator;

    // For top 3 positions, use medal images
    if (position <= 3) {
      const imageSource = POSITION_IMAGES[position];
      positionIndicator = imageSource ? (
        <PositionImage source={imageSource} />
      ) : null;
    } else {
      // For positions beyond 3, use text indicators
      positionIndicator = (
        <PositionText>
          {formatMessage(messages.positionPrefix, { position })}
        </PositionText>
      );
    }

    // If this is the current user, add the "(you)" indicator
    if (isCurrentUser) {
      return (
        <ActionContainer>
          <YouIndicator size="xs">
            {formatMessage(messages.youIndicator)}
          </YouIndicator>
          {positionIndicator}
        </ActionContainer>
      );
    }

    return positionIndicator;
  };

  // Create steps display with icon
  const getStepsDisplay = (steps: number) => (
    <StepsContainer>
      <StyledFootprintsIcon size={12} />
      <BaseText size="xs" color={70}>
        {formatMessage(messages.stepsText, { steps: steps.toLocaleString() })}
      </BaseText>
    </StepsContainer>
  );

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
          icon={<Trophy />}
          title={formatMessage(messages.errorTitle)}
          content={formatMessage(messages.errorContent)}
        />
      </EmptyStateContainer>
    );
  }

  const hasNoData = !leaderboard || leaderboard.length === 0;

  if (hasNoData) {
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

  // Find current user's position from the data
  const currentUserEntry = leaderboard.find((entry) => entry.id === user?.id);
  const userPosition = currentUserEntry?.position || 0;

  return (
    <Container>
      {userPosition > 0 && (
        <PositionWrapper>
          <StyledTrophyIcon size={16} />

          <BaseText size="s">
            {formatMessage(messages.userPosition, {
              position: userPosition,
              suffix: getOrdinalSuffix(userPosition),
            })}
          </BaseText>
        </PositionWrapper>
      )}

      <ListContainer>
        {leaderboard.map((entry) => {
          const isCurrentUser = entry.id === user?.id;

          return (
            <FriendItem
              key={entry.id}
              user={{
                id: entry.id,
                firstName: entry.firstName,
                lastName: entry.lastName,
                email: entry.email,
                gender: entry.gender as Gender,
                isFriend: false,
                activities: [],
              }}
              action={getPositionIndicator(entry.position, isCurrentUser)}
              descriptionType="value"
              descriptionValue={getStepsDisplay(entry.totalSteps)}
              gradientColors={
                entry.position <= 3
                  ? POSITION_GRADIENTS[entry.position]
                  : undefined
              }
            />
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default LeaderboardList;
