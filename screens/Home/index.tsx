import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import Header from "./Header";
import StepsSection from "./StepsSection";
import HistorySection from "./HistorySection";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const HomeScreen = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Container>
          <Header />

          <HistorySection />

          <StepsSection />
        </Container>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
