import React from "react";
import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import { Link } from "expo-router";
import styled, { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/hooks";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import BaseText from "@/components/ui/BaseText";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Header from "./Header";
import { messages } from "./messages";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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

const UnderlinedText = styled(BaseText)`
  text-decoration-line: underline;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

const UnderlinedBrandText = styled(BaseText)`
  text-decoration-line: underline;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.main};
`;

const ErrorText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.error.main};
  margin-top: 4px;
`;

const ButtonContent = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LoginScreen = () => {
  const { login } = useAuth();
  const { formatMessage } = useIntl();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (formData: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(formData);
      // No need to navigate - AuthContext will handle redirection
    } catch (error: any) {
      // Handle specific errors from the API
      if (error?.response?.status === 401) {
        setError("root", {
          message: "Incorrect email or password",
        });
      } else {
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    Linking.openURL("mailto:support@stepsquad.com?subject=Help%20with%20Login");
  };

  return (
    <SafeAreaWrapper>
      <Container>
        <Header />

        <InputWrapper>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.email)}
                  placeholder={formatMessage(messages.emailPlaceholder)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  type="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={
                    errors.email ? String(errors.email.message) : undefined
                  }
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.password)}
                  placeholder={formatMessage(messages.passwordPlaceholder)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  type="password"
                  secureTextEntry
                  error={
                    errors.password
                      ? String(errors.password.message)
                      : undefined
                  }
                />
              </View>
            )}
          />

          {errors.root && (
            <ErrorText size="xs">{errors.root.message}</ErrorText>
          )}

          <LinksWrapper>
            <Pressable onPress={handleSendEmail}>
              <UnderlinedText size="xs">
                {formatMessage(messages.needHelp)}
              </UnderlinedText>
            </Pressable>

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable>
                <UnderlinedText size="xs">
                  {formatMessage(messages.forgotPassword)}
                </UnderlinedText>
              </Pressable>
            </Link>
          </LinksWrapper>
        </InputWrapper>

        <Button
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 56 }}
          isDisabled={isLoading}
        >
          {isLoading ? (
            <ButtonContent>
              <ActivityIndicator size="small" color="white" />
              <BaseText color="white" fontWeight="600">
                {formatMessage(messages.login)}
              </BaseText>
            </ButtonContent>
          ) : (
            formatMessage(messages.login)
          )}
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
