import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";
import { getOrdinalSuffix } from "@/services/utils/string";
import messages from "./messages";
import { BaseText } from "@/components/ui";
import { Footprints, Trophy } from "lucide-react-native";
import { DefaultTheme } from "styled-components";
import FriendItem from "../Friends/FriendItem";
import { useThemeContext, useUser } from "@/hooks";
import {
  DARK_MODE_GRADIENTS,
  LIGHT_MODE_GRADIENTS,
  POSITION_IMAGES,
} from "./constants";

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

interface LeaderboardListProps {
  type: LeaderboardType;
}

const LeaderboardList = ({ type }: LeaderboardListProps) => {
  const { formatMessage } = useIntl();
  const { user } = useUser();
  const { themeMode } = useThemeContext();

  // Example user position - this would come from your data in a real implementation
  const userPosition = 2;

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

  // Example step counts for each user in the leaderboard
  // In a real app, this would come from your API or database
  const getStepCount = (position: number) => {
    // Create some sample data that decreases with position
    const baseSteps = 15000;
    const steps = Math.floor(
      baseSteps - (position - 1) * 500 + Math.random() * 200
    );
    return steps;
  };

  return (
    <Container>
      <PositionWrapper>
        <StyledTrophyIcon size={16} />

        <BaseText size="s">
          {formatMessage(messages.userPosition, {
            position: userPosition,
            suffix: getOrdinalSuffix(userPosition),
          })}
        </BaseText>
      </PositionWrapper>

      <ListContainer>
        {[...Array(10)].map((_, index) => {
          const position = index + 1;
          // In a real app, you would compare user IDs or a unique identifier
          const isCurrentUser = position === userPosition;
          const steps = getStepCount(position);

          return (
            <FriendItem
              key={index}
              user={user!}
              action={getPositionIndicator(position, isCurrentUser)}
              descriptionType="value"
              descriptionValue={getStepsDisplay(steps)}
              gradientColors={
                position <= 3 ? POSITION_GRADIENTS[position] : undefined
              }
            />
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default LeaderboardList;
