import React from "react";
import { Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NotFoundScreen = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>Not found</Container>
    </>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
