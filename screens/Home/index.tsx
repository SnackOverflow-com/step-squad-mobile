import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { View } from "react-native";
import styled from "styled-components/native";
import Header from "./Header";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const HomeScreen = () => {
  return (
    <SafeAreaWrapper>
      <Container>
        <Header />
      </Container>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
