import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { View } from "react-native";
import styled from "styled-components/native";
import { BaseText } from "@/components/ui";
import { useUser } from "@/hooks";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const HomeScreen = () => {
  const { user, isLoading, error } = useUser();

  console.log("user", user);

  return (
    <SafeAreaWrapper>
      <Container>
        <BaseText>Home</BaseText>
      </Container>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
