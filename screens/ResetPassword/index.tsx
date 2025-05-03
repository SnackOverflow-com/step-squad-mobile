import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
import { useRoute } from "@react-navigation/native";
import { useIntl } from "react-intl";
import { sendResetPasswordRequest } from "@/services/api/auth";
import { ResetPasswordRequest } from "@/types/auth/reset-password-request";
import { useToast } from "@/components/ui";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import BaseText from "@/components/ui/BaseText";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Header from "./Header";
import { messages } from "./messages";
import { useRouter } from "expo-router";

// Styled components (reused from LoginScreen)
const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const InputWrapper = styled(View)`
  gap: 12px;
`;

const ButtonContent = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ResetPasswordScreen = () => {
  const { formatMessage } = useIntl();
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // Extract token and email from route params
    // @ts-ignore
    const { token: routeToken, email: routeEmail } = route.params ?? {};
    if (routeToken) {
      setToken(routeToken);
    }
    if (routeEmail) {
      setEmail(routeEmail);
    }
  }, [route.params]);

  const handleResetPassword = async () => {
    if (!token) {
      toast.error({
        title: formatMessage(messages.error),
        description: formatMessage(messages.noToken),
      });
      return;
    }

    try {
      setIsLoading(true);
      await sendResetPasswordRequest({
        token,
        newPassword,
      } as ResetPasswordRequest);
      toast.success({
        title: formatMessage(messages.success),
        description: formatMessage(messages.successReset),
      });
    } catch (error) {
      toast.error({
        title: formatMessage(messages.error),
        description:
          // @ts-ignore
          error.response?.data?.message ?? formatMessage(messages.errorDefault),
      });
    } finally {
      setIsLoading(false);
      router.navigate("/(auth)/login");
    }
  };

  return (
    <SafeAreaWrapper>
      <Container>
        <Header />
        <InputWrapper>
          {token ? (
            <>
              <TextInput
                placeholder={formatMessage(messages.newPasswordPlaceholder)}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button
                onPress={handleResetPassword}
                style={{ marginTop: 35 }}
                isDisabled={isLoading}
              >
                {isLoading ? (
                  <ButtonContent>
                    <ActivityIndicator size="small" color="white" />
                    <BaseText fontWeight="600">
                      {formatMessage(messages.resetPassword)}
                    </BaseText>
                  </ButtonContent>
                ) : (
                  formatMessage(messages.resetPassword)
                )}
              </Button>
            </>
          ) : (
            <BaseText size="s">
              {formatMessage(messages.checkEmail, {
                email: email || "your inbox",
              })}
            </BaseText>
          )}
        </InputWrapper>
      </Container>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;
