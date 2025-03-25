import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Link } from "expo-router";
import styled from "styled-components/native";

import { useAuth } from "@/hooks";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import BaseText from "@/components/ui/BaseText";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Title = styled(BaseText)`
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
`;

// Simplest possible LinkText definition
const LinkText = styled(BaseText)`
  text-align: center;
  margin-top: 16px;
`;

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // For now, just call the register function without validation
    register();
  };

  return (
    <SafeAreaWrapper>
      <Container>
        <Title fontWeight="700" size="xl">
          Create Account
        </Title>

        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          type="email"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          type="password"
          secureTextEntry
        />

        <Button onPress={handleRegister} style={{ marginTop: 24 }}>
          Register
        </Button>

        <Link href="/(auth)/login" asChild>
          <Pressable>
            <LinkText fontWeight="500" size="s" style={{ color: "#0070f3" }}>
              Already have an account? Login
            </LinkText>
          </Pressable>
        </Link>
      </Container>
    </SafeAreaWrapper>
  );
}
