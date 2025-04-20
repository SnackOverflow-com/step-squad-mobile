import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { useIntl } from "react-intl";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Header from "@/components/MainHeader";
import messages from "./messages";
import Switcher, { SwitcherOption } from "@/components/ui/Switcher";
import LeaderboardList from "./LeaderboardList";
import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    gap: 16,
    flex: 1,
  },
})`
  flex: 1;
  padding: 16px;
`;

const tabOptions: SwitcherOption[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

const LeaderboardScreen = () => {
  const { formatMessage } = useIntl();
  const [selectedTab, setSelectedTab] = useState<string>("DAILY");

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />

        <Switcher
          options={tabOptions}
          value={selectedTab}
          onChange={setSelectedTab}
        />

        <LeaderboardList type={selectedTab as LeaderboardType} />
      </Container>
    </SafeAreaWrapper>
  );
};

export default LeaderboardScreen;
