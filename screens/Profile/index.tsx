import React from "react";
import { ActivityIndicator, View } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Button from "@/components/ui/Button";
import BaseText from "@/components/ui/BaseText";
import TextInput from "@/components/ui/TextInput";
import Dropdown from "@/components/ui/Dropdown";
import Header from "./Header";
import { messages } from "./messages";
import { useThemeContext, useUser } from "@/hooks";
import { Gender } from "@/types/user/gender";
import { updateUser } from "@/services/api/user";
import { UserUpdateRequest } from "@/types/user/user-update-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, messages.firstName.minLength)
    .max(30, messages.firstName.maxLength),
  lastName: z
    .string()
    .min(1, messages.lastName.minLength)
    .max(30, messages.lastName.maxLength),
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(0).max(150).optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "UNSPECIFIED"]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const InputWrapper = styled(View)`
  gap: 12px;
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

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ProfileScreen = () => {
  const { formatMessage } = useIntl();
  const { toggleTheme } = useThemeContext();
  const { user, isLoading, error, refetch } = useUser();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: undefined,
      gender: "UNSPECIFIED",
    },
    resolver: zodResolver(profileSchema),
  });

  const updateUserMutation = useMutation({
    mutationFn: (userUpdateRequest: UserUpdateRequest) =>
      updateUser(userUpdateRequest),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
    onError: (error: any) => {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
      console.error("Profile edit error:", error);
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        age: user.age || undefined,
        gender: user.gender || "UNSPECIFIED",
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData: ProfileFormValues) => {
    const userUpdateRequest = {
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
    } as UserUpdateRequest;

    updateUserMutation.mutate(userUpdateRequest);
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </LoadingContainer>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper>
        <Container>
          <Header />
          <ErrorText size="m">
            Failed to load user data. Please try again.
          </ErrorText>
          <Button onPress={() => refetch()}>Retry</Button>
        </Container>
      </SafeAreaWrapper>
    );
  }

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
                  placeholder={messages.firstName.defaultMessage}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
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
                  placeholder={messages.lastName.defaultMessage}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
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
                  placeholder={messages.email.defaultMessage}
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
            name="age"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.age)}
                  placeholder="Enter your age"
                  value={value?.toString() || ""}
                  onChangeText={(text) =>
                    onChange(text === "" ? "" : Number(text))
                  }
                  onBlur={onBlur}
                  keyboardType="numeric"
                  error={errors.age ? String(errors.age.message) : undefined}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={formatMessage(messages.gender)}
                value={value}
                items={Object.keys(Gender).map((gender) => ({
                  label: formatMessage({
                    id: `profile.gender.${gender.toLowerCase()}`,
                    defaultMessage:
                      gender[0].toUpperCase() +
                      gender.substring(1).toLowerCase(),
                  }),
                  value: gender,
                }))}
                onValueChange={onChange}
                placeholder="Select gender"
                error={
                  errors.gender ? String(errors.gender.message) : undefined
                }
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 56 }}
            isDisabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <ButtonContent>
                <ActivityIndicator size="small" color="white" />
                <BaseText color="white" fontWeight="600">
                  {formatMessage(messages.save)}
                </BaseText>
              </ButtonContent>
            ) : (
              formatMessage(messages.save)
            )}
          </Button>

          {errors.root && (
            <ErrorText size="xs">{errors.root.message}</ErrorText>
          )}
        </InputWrapper>

        <Button onPress={toggleTheme} style={{ marginTop: 24 }}>
          {formatMessage(messages.toggleTheme)}
        </Button>
      </Container>
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;
