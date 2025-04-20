import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Plus, Minus } from "lucide-react-native";
import { DefaultTheme } from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { BaseText, CircleChart, Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import WaterGlass from "./WaterGlass";
import { useConfetti } from "@/hooks/useConfetti";
import { getActivity, updateActivity } from "@/services/api/activity";
import { ActivityType } from "@/types/activity/activity-type";
import { ActivityUpdateRequest } from "@/types/activity/activity-update-request";
import { Activity } from "@/types/activity/activity";
import { useUser } from "@/hooks";

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
  const { user } = useUser();
  const theme = useTheme();
  const { playConfetti } = useConfetti();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [incrementAmount] = useState(100); // 100ml increment

  // Fetch water activity data
  const {
    data: waterActivity,
    isLoading,
    isError,
    refetch,
  } = useQuery<Activity>({
    queryKey: ["activity", ActivityType.WATER, user?.id],
    queryFn: () => getActivity(ActivityType.WATER),
  });

  // Mutation for updating water activity
  const updateWaterMutation = useMutation({
    mutationFn: (updateRequest: ActivityUpdateRequest) => {
      return updateActivity(updateRequest);
    },
    onSuccess: (updatedActivity) => {
      // Invalidate and refetch queries related to this activity
      queryClient.invalidateQueries({
        queryKey: ["activity", ActivityType.WATER],
      });

      // Show success message if goal reached - but only when crossing the threshold
      // Check if it's exactly at the goal or just crossed it from below
      if (
        waterActivity &&
        !waterActivity.isGoalReached &&
        updatedActivity.quantity >= updatedActivity.goal &&
        waterActivity.quantity < updatedActivity.goal
      ) {
        playConfetti();
        toast.success({
          title: "Daily water intake reached!",
          description: "Great job staying hydrated today!",
        });
      }
    },
    onError: (error) => {
      toast.error({
        title: "Error",
        description: "Failed to update water intake",
      });
    },
  });

  // Calculate derived values
  const currentWaterIntake = waterActivity?.quantity || 0;
  const waterGoal = waterActivity?.goal || 2000; // Default to 2L if not loaded
  const fillPercentage = Math.min(currentWaterIntake / waterGoal, 1); // Cap at 100% for visualization

  // Handler for incrementing water intake
  const handleIncrement = () => {
    if (!waterActivity) return;

    // Remove the maximum limit - allow users to track intake beyond the goal
    const newValue = currentWaterIntake + incrementAmount;

    // Only update if there's a change
    if (newValue === currentWaterIntake) return;

    // Ensure we're passing the correct data structure
    const updateRequest: ActivityUpdateRequest = {
      id: waterActivity.id,
      date: waterActivity.date,
      quantity: newValue,
    };

    updateWaterMutation.mutate(updateRequest);
  };

  // Handler for decrementing water intake
  const handleDecrement = () => {
    if (!waterActivity) return;

    const newValue = Math.max(currentWaterIntake - incrementAmount, 0);

    // Only update if there's a change
    if (newValue === currentWaterIntake) return;

    // Ensure we're passing the correct data structure
    const updateRequest: ActivityUpdateRequest = {
      id: waterActivity.id,
      date: waterActivity.date,
      quantity: newValue,
    };

    updateWaterMutation.mutate(updateRequest);
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
        {currentWaterIntake > waterGoal && (
          <BaseText size="s" style={{ color: theme.success }}>
            {" "}
            (+{((currentWaterIntake - waterGoal) / 1000).toFixed(1)}L)
          </BaseText>
        )}
      </InfoText>
    </ChartContent>
  );

  if (isLoading) {
    return (
      <Container style={{ backgroundColor: theme.card }}>
        <ChartContainer>
          <ChartContent>
            <BaseText size="s" style={{ color: theme.textSecondary }}>
              Loading water intake data...
            </BaseText>
          </ChartContent>
        </ChartContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container style={{ backgroundColor: theme.card }}>
        <ChartContainer>
          <ChartContent>
            <BaseText size="s" style={{ color: theme.error.main }}>
              Failed to load water intake data
            </BaseText>
            <Button variant="primary" size="s" onPress={() => refetch()}>
              Retry
            </Button>
          </ChartContent>
        </ChartContainer>
      </Container>
    );
  }

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
        <IconButton
          onPress={handleDecrement}
          disabled={updateWaterMutation.isPending}
        >
          <Minus size={24} color={theme.text} />
        </IconButton>

        <AmountDisplay>
          <BaseText size="l" fontWeight="600" style={{ color: theme.text }}>
            {incrementAmount}ml
          </BaseText>
        </AmountDisplay>

        <IconButton
          onPress={handleIncrement}
          disabled={updateWaterMutation.isPending}
        >
          <Plus size={24} color={theme.text} />
        </IconButton>
      </ControlsContainer>
    </Container>
  );
};

export default WaterIntakeSection;
