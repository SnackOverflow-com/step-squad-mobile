import { Button } from "@/components/ui";
import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import { css, DefaultTheme } from "styled-components";
import styled from "styled-components/native";
import { useQuery } from "@tanstack/react-query";
import { FormattedDate } from "react-intl";

import { getActivityHistory } from "@/services/api/activity";
import { ActivityType } from "@/types/activity/activity-type";
import { ActivityTimeRange } from "@/types/activity/activity-time-range";
import { ActivityResponse } from "@/types/activity/activity-response";

const Container = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: 4,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
})`
  flex-direction: row;
`;

const HistoryButton = styled(Button)<{ $isSelected: boolean }>`
  height: auto;
  align-self: flex-start;
  padding: 4px 8px;

  ${({ $isSelected, theme }: { $isSelected: boolean; theme: DefaultTheme }) =>
    $isSelected &&
    css`
      border: 1px solid ${theme.primary.main};
    `}
`;

const EmptyStateText = styled.Text`
  padding: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
  font-size: 14px;
`;

// Map of emoji suggestions based on activity value relative to goal
const getEmoji = (value: number): string => {
  if (value <= 0) return "😴";
  if (value < 0.3) return "🥲";
  if (value < 0.6) return "😊";
  if (value < 0.9) return "😍";
  return "🥳";
};

interface HistorySectionProps {
  activityType?: ActivityType;
  onSelectDay?: (day: string, activity: ActivityResponse) => void;
}

const HistorySection = ({
  activityType = ActivityType.STEPS,
  onSelectDay,
}: HistorySectionProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Format today's date as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0]; // This gives us YYYY-MM-DD format
  const [selectedDay, setSelectedDay] = React.useState<string | null>(today);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["activityHistory", activityType],
    queryFn: () => getActivityHistory(activityType, 5, ActivityTimeRange.DAYS),
  });

  const history = data?.activities;

  // Handle loading, error, or empty data states
  if (isLoading) {
    return (
      <View>
        <Container>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <HistoryButton key={index} variant="outline" size="s">
                ...
              </HistoryButton>
            ))}
        </Container>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <EmptyStateText>Something broke!</EmptyStateText>
      </View>
    );
  }

  const handleHistoryItemPress = (item: ActivityResponse) => {
    setSelectedDay(item.date);
    // Call the parent callback to update the main UI
    if (onSelectDay) {
      onSelectDay(item.date, item);
    }
  };

  if (!history) return null;

  return (
    <View>
      <Container
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {history.map((item) => {
          const date = new Date(item.date);
          const emoji = getEmoji(item.quantity);
          const isSelected = item.date === selectedDay;

          return (
            <HistoryButton
              key={item.date}
              $isSelected={isSelected}
              variant="outline"
              size="s"
              onPress={() => handleHistoryItemPress(item)}
            >
              {emoji}{" "}
              <FormattedDate value={date} weekday="short" day="numeric" />
            </HistoryButton>
          );
        })}
      </Container>
    </View>
  );
};

export default HistorySection;
