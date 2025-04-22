import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import React, { useState } from "react";
import StepsSection from "./StepsSection";
import HistorySection from "./HistorySection";
import Header from "@/components/MainHeader";
import { useUser } from "@/hooks";
import { useIntl } from "react-intl";
import messages from "./messages";
import { ActivityResponse } from "@/types/activity/activity-response";
import { ActivityType } from "@/types/activity/activity-type";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const HomeScreen = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityResponse | null>(null);

  const handleDaySelect = (day: string, activity: ActivityResponse) => {
    setSelectedDay(day);
    setSelectedActivity(activity);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Container>
          <Header
            title={formatMessage(messages.welcome, { name: user?.firstName })}
          />

          <HistorySection
            activityType={ActivityType.STEPS}
            onSelectDay={handleDaySelect}
          />

          <StepsSection
            selectedDay={selectedDay || undefined}
            historicalActivity={selectedActivity || undefined}
          />
        </Container>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
