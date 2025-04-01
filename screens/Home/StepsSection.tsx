import React from "react";
import { View } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";

import { BaseText, CircleChart } from "@/components/ui";
import messages from "./messages";

const Container = styled(View)`
  width: 100%;
  border-radius: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.card};
  padding: 20px;
`;

const ChartContainer = styled(View)`
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  width: 100%;
  height: 100%;
  align-self: center;
  max-width: 300px;
`;

const ChartContent = styled(View)`
  align-items: center;
  justify-content: center;
`;

const StepValue = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const StepGoal = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

const StepsSection = () => {
  const { formatMessage } = useIntl();
  const currentSteps = 10189; // Example value
  const stepGoal = 20000; // Example goal

  // Render the content inside the chart
  const renderChartContent = () => (
    <ChartContent>
      <StepValue size="xxl" fontWeight="700">
        {currentSteps.toLocaleString()}
      </StepValue>

      <StepGoal size="s">
        {formatMessage(messages.stepGoal, { goal: stepGoal.toLocaleString() })}
      </StepGoal>
    </ChartContent>
  );

  return (
    <Container>
      <ChartContainer>
        <CircleChart
          value={currentSteps}
          maxValue={stepGoal}
          strokeWidth={16}
          content={renderChartContent()}
        />
      </ChartContainer>
    </Container>
  );
};

export default StepsSection;
