import React from "react";
import {
  View,
  Pressable,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";
import { useForm, Controller } from "react-hook-form";
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
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Container = styled(ScrollView)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const InputWrapper = styled(View)`
  gap: 12px;
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

const RegisterScreen = () => {
  const { register } = useAuth();
  const { formatMessage } = useIntl();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (formData: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await register(formData);
      // No need to navigate - AuthContext will handle redirection
    } catch (error: any) {
      // Handle specific errors from the API
      if (error?.response?.status === 409) {
        setError("email", {
          message: "This email is already registered",
        });
      } else {
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    Linking.openURL(
      "mailto:support@stepsquad.com?subject=Help%20with%20Registration"
    );
  };

  return (
    <SafeAreaWrapper>
      <Container>
        <Header />

        <InputWrapper>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.firstName)}
                  placeholder={formatMessage(messages.firstNamePlaceholder)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={
                    errors.firstName
                      ? String(errors.firstName.message)
                      : undefined
                  }
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.lastName)}
                  placeholder={formatMessage(messages.lastNamePlaceholder)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={
                    errors.lastName
                      ? String(errors.lastName.message)
                      : undefined
                  }
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.email)}
                  placeholder="johndoe@stepsquad.com"
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

          <Pressable
            onPress={handleSendEmail}
            style={{ alignSelf: "flex-start" }}
          >
            <UnderlinedText size="xs">
              {formatMessage(messages.needHelp)}
            </UnderlinedText>
          </Pressable>
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
                {formatMessage(messages.register)}
              </BaseText>
            </ButtonContent>
          ) : (
            formatMessage(messages.register)
          )}
        </Button>

        <Pressable style={{ alignItems: "center" }}>
          <BaseText size="xs">
            {formatMessage(messages.alreadyHaveAccount, {
              link: (chunk) => (
                <Link href="/(auth)/login" asChild>
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

export default RegisterScreen;
