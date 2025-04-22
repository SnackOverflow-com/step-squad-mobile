import React from "react";
import { View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useIntl } from "react-intl";

import { BaseText, CircleChart } from "@/components/ui";
import { useStepCounter } from "@/hooks";
import messages from "./messages";
import { ActivityResponse } from "@/types/activity/activity-response";

const Container = styled(View)`
  width: 100%;
  border-radius: 16px;
`;

const ChartContainer = styled(View)`
  align-items: center;
  justify-content: center;
  width: 100%;
  align-self: center;
  max-width: 300px;
  aspect-ratio: 1;
  margin: 16px 0;
`;

const ChartContent = styled(View)`
  align-items: center;
  justify-content: center;
`;

interface StepsSectionProps {
  selectedDay?: string;
  historicalActivity?: ActivityResponse;
}

const StepsSection = ({
  selectedDay,
  historicalActivity,
}: StepsSectionProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { currentStepCount, stepGoal } = useStepCounter();

  // Determine if we should show today's data or historical data
  const isToday =
    !selectedDay || selectedDay === new Date().toISOString().split("T")[0];

  // The value to display - today's steps or historical steps
  const displaySteps = isToday
    ? currentStepCount
    : historicalActivity?.quantity || 0;

  // Use the goal from the historical activity or today's goal
  const chartGoal = isToday ? stepGoal : historicalActivity?.goal || stepGoal;

  // For date display in the subtitle
  const dateString = isToday
    ? ""
    : formatMessage(messages.historicalSteps, {
        date: new Date(selectedDay || "").toLocaleDateString(),
      });

  const renderChartContent = () => (
    <ChartContent>
      <BaseText size="xxl" fontWeight="700" style={{ color: theme.text }}>
        {displaySteps.toLocaleString()}
      </BaseText>

      <BaseText size="s" style={{ color: theme.textSecondary }}>
        {formatMessage(messages.stepGoal, { goal: chartGoal.toLocaleString() })}
      </BaseText>

      {!isToday && (
        <BaseText size="s" style={{ color: theme.textSecondary, marginTop: 4 }}>
          {dateString}
        </BaseText>
      )}
    </ChartContent>
  );

  return (
    <Container style={{ backgroundColor: theme.card }}>
      <ChartContainer>
        <CircleChart
          value={displaySteps}
          maxValue={chartGoal}
          strokeWidth={16}
          content={renderChartContent()}
        />
      </ChartContainer>
    </Container>
  );
};

export default StepsSection;
