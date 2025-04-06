import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components/native";

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
  margin-bottom: 16px;
  width: 100%;
  align-self: center;
  max-width: 300px;
`;

const ChartContent = styled(View)`
  align-items: center;
  justify-content: center;
`;

const StepValue = styled(BaseText)``;

const StepGoal = styled(BaseText)``;

const InfoText = styled(BaseText)`
  text-align: center;
  margin: 16px;
`;

const StepsSection = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { currentStepCount, stepGoal, isPedometerAvailable } = useStepCounter();

  const renderChartContent = () => (
    <ChartContent>
      <StepValue size="xxl" fontWeight="700" style={{ color: theme.text }}>
        {currentStepCount.toLocaleString()}
      </StepValue>

      <StepGoal size="s" style={{ color: theme.textSecondary }}>
        {formatMessage(messages.stepGoal, { goal: stepGoal.toLocaleString() })}
      </StepGoal>
    </ChartContent>
  );

  if (isPedometerAvailable === "checking") {
    return (
      <Container
        style={{
          backgroundColor: theme.card,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary.main || theme.text}
        />
        <InfoText
          size="m"
          style={{ color: theme.textSecondary, marginTop: 10 }}
        >
          Checking pedometer availability...
        </InfoText>
      </Container>
    );
  }

  if (isPedometerAvailable !== "true") {
    return (
      <Container
        style={{
          backgroundColor: theme.card,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InfoText size="m" style={{ color: theme.error }}>
          Pedometer is not available or permission was denied.
        </InfoText>
      </Container>
    );
  }

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
