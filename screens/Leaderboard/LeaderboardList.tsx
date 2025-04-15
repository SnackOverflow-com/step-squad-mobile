import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";
import { getOrdinalSuffix } from "@/services/utils/string";
import messages from "./messages";
import { BaseText } from "@/components/ui";
import { Trophy } from "lucide-react-native";
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
      positionIndicator = <PositionText>#{position}</PositionText>;
    }

    // If this is the current user, add the "(you)" indicator
    if (isCurrentUser) {
      return (
        <ActionContainer>
          <YouIndicator size="xs">(you)</YouIndicator>
          {positionIndicator}
        </ActionContainer>
      );
    }

    return positionIndicator;
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
          // For this example, let's say position 4 is the current user
          const isCurrentUser = position === userPosition;

          return (
            <FriendItem
              key={index}
              user={user!}
              action={getPositionIndicator(position, isCurrentUser)}
              descriptionType="ageGender"
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
