import React, { useState } from "react";
import { View, Pressable, Linking } from "react-native";
import { Link } from "expo-router";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";

import { useAuth } from "@/hooks";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import BaseText from "@/components/ui/BaseText";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Header from "./Header";
import { messages } from "./messages";

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const InputWrapper = styled(View)`
  gap: 12px;
`;

const LinksWrapper = styled(View)`
  flex-direction: row;
  gap: 12px;
  justify-content: space-between;
`;

const LinkText = styled(BaseText)`
  text-align: center;
  margin-top: 16px;
`;

const UnderlinedText = styled(BaseText)`
  text-decoration-line: underline;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

const UnderlinedBrandText = styled(BaseText)`
  text-decoration-line: underline;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.main};
`;

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { formatMessage } = useIntl();

  const handleLogin = () => {
    // For now, just call the login function without validation
    login();
  };

  const handleSendEmail = () => {
    Linking.openURL("mailto:support@stepsquad.com?subject=Help%20with%20Login");
  };

  return (
    <SafeAreaWrapper>
      <Container>
        <Header />

        <InputWrapper>
          <TextInput
            label={formatMessage(messages.email)}
            placeholder="johndoe@stepsquad.com"
            value={email}
            onChangeText={setEmail}
            type="email"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label={formatMessage(messages.password)}
            value={password}
            onChangeText={setPassword}
            type="password"
            secureTextEntry
          />

          <LinksWrapper>
            <Pressable onPress={handleSendEmail}>
              <UnderlinedText size="xs">
                {formatMessage(messages.needHelp)}
              </UnderlinedText>
            </Pressable>

            <Link href="/(auth)/register" asChild>
              <Pressable>
                <UnderlinedText size="xs">
                  {formatMessage(messages.forgotPassword)}
                </UnderlinedText>
              </Pressable>
            </Link>
          </LinksWrapper>
        </InputWrapper>

        <Button onPress={handleLogin} style={{ marginTop: 56 }}>
          {formatMessage(messages.login)}
        </Button>

        <Pressable style={{ alignItems: "center" }}>
          <BaseText size="xs">
            {formatMessage(messages.dontHaveAccount, {
              link: (chunk) => (
                <Link href="/(auth)/register" asChild>
                  <UnderlinedBrandText size="xs">{chunk}</UnderlinedBrandText>
                </Link>
              ),
            })}
          </BaseText>
        </Pressable>
      </Container>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;
