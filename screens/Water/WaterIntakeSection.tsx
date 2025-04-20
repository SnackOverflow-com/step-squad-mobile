import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Plus, Minus } from "lucide-react-native";
import { DefaultTheme } from "styled-components";

import { BaseText, CircleChart } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import WaterGlass from "./WaterGlass";
import { useConfetti } from "@/hooks/useConfetti";

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

const InfoText = styled(BaseText)`
  margin-top: 8px;
  text-align: center;
`;

const ControlsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 16px;
`;

const AmountDisplay = styled(View)`
  align-items: center;
  justify-content: center;
`;

const IconButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.card};
`;

const WaterIntakeSection = () => {
  const theme = useTheme();
  const { playConfetti } = useConfetti();
  const toast = useToast();

  // State for water tracking
  const [currentWaterIntake, setCurrentWaterIntake] = useState(1200); // 1.2L
  const [incrementAmount] = useState(100); // 100ml
  const waterGoal = 2000; // 2L
  const fillPercentage = currentWaterIntake / waterGoal;

  // Handler for incrementing water intake
  const handleIncrement = () => {
    const newValue = Math.min(currentWaterIntake + incrementAmount, waterGoal);
    setCurrentWaterIntake(newValue);

    // Play confetti and show toast when reaching goal
    if (newValue === waterGoal) {
      playConfetti();
      toast.success({
        title: "Daily water intake reached!",
        description: "Great job staying hydrated today!",
      });
    }
  };

  // Handler for decrementing water intake
  const handleDecrement = () => {
    setCurrentWaterIntake((prev) => Math.max(prev - incrementAmount, 0));
  };

  const renderChartContent = () => (
    <ChartContent>
      <WaterGlass
        size={100}
        fillPercentage={fillPercentage}
        color={theme.info.main}
        backgroundColor={theme.contrast[20]}
      />

      <InfoText size="s" style={{ color: theme.textSecondary }}>
        {(currentWaterIntake / 1000).toFixed(1)}L /{" "}
        {(waterGoal / 1000).toFixed(1)}L
      </InfoText>
    </ChartContent>
  );

  return (
    <Container style={{ backgroundColor: theme.card }}>
      <ChartContainer>
        <CircleChart
          value={currentWaterIntake}
          maxValue={waterGoal}
          strokeWidth={16}
          valueColor={theme.info.main}
          content={renderChartContent()}
        />
      </ChartContainer>

      <ControlsContainer>
        <IconButton onPress={handleDecrement}>
          <Minus size={24} color={theme.text} />
        </IconButton>

        <AmountDisplay>
          <BaseText size="l" fontWeight="600" style={{ color: theme.text }}>
            {incrementAmount}ml
          </BaseText>
        </AmountDisplay>

        <IconButton onPress={handleIncrement}>
          <Plus size={24} color={theme.text} />
        </IconButton>
      </ControlsContainer>
    </Container>
  );
};

export default WaterIntakeSection;
