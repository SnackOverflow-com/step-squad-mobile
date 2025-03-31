import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { View } from "react-native";
import styled from "styled-components/native";
import Header from "./Header";
import StepsSection from "./StepsSection";
import HistorySection from "./HistorySection";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 8px;
`;

const HomeScreen = () => {
  return (
    <SafeAreaWrapper>
      <Container>
        <Header />

        <HistorySection />

        <StepsSection />
      </Container>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
