import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import StepsSection from "./StepsSection";
import HistorySection from "./HistorySection";
import Header from "@/components/MainHeader";
import { useUser } from "@/hooks";
import { useIntl } from "react-intl";
import messages from "./messages";
const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const HomeScreen = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Container>
          <Header
            title={formatMessage(messages.welcome, { name: user?.firstName })}
          />

          <HistorySection />

          <StepsSection />
        </Container>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
