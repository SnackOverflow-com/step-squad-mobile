import React from "react";
import { View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useIntl } from "react-intl";

import { BaseText, CircleChart } from "@/components/ui";
import { useStepCounter } from "@/hooks";
import messages from "./messages";

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

const StepsSection = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { currentStepCount, stepGoal } = useStepCounter();

  const renderChartContent = () => (
    <ChartContent>
      <BaseText size="xxl" fontWeight="700" style={{ color: theme.text }}>
        {currentStepCount.toLocaleString()}
      </BaseText>

      <BaseText size="s" style={{ color: theme.textSecondary }}>
        {formatMessage(messages.stepGoal, { goal: stepGoal.toLocaleString() })}
      </BaseText>
    </ChartContent>
  );

  return (
    <Container style={{ backgroundColor: theme.card }}>
      <ChartContainer>
        <CircleChart
          value={currentStepCount}
          maxValue={stepGoal}
          strokeWidth={16}
          content={renderChartContent()}
        />
      </ChartContainer>
    </Container>
  );
};

export default StepsSection;
