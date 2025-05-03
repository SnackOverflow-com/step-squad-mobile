import React from "react";
import { Stack } from "expo-router";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>Not found</Container>
    </>
  );
};

export default NotFoundScreen;
