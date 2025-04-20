import React from "react";
import { ActivityIndicator, View } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { Button, BaseText, TextInput, Select, useToast } from "@/components/ui";
import Header from "@/components/MainHeader";
import { Gender, UserUpdateRequest, ActivityDifficulty } from "@/types";
import { useThemeContext, useUser } from "@/hooks";
import { updateUser } from "@/services/api/user";
import { messages } from "./messages";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, messages.firstName.minLength)
    .max(30, messages.firstName.maxLength),
  lastName: z
    .string()
    .min(1, messages.lastName.minLength)
    .max(30, messages.lastName.maxLength),
  age: z.number().min(0).max(150).optional().or(z.literal("")),
  gender: z.nativeEnum(Gender).optional(),
  difficulty: z.nativeEnum(ActivityDifficulty),
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
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProfileFormValues>({
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender ?? Gender.UNSPECIFIED,
          difficulty: user.difficulty ?? ActivityDifficulty.MEDIUM,
        }
      : {
          firstName: "",
          lastName: "",
          age: undefined,
          gender: Gender.UNSPECIFIED,
          difficulty: ActivityDifficulty.MEDIUM,
        },
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender ?? Gender.UNSPECIFIED,
          difficulty: user.difficulty ?? ActivityDifficulty.MEDIUM,
        }
      : undefined,
  });

  const updateUserMutation = useMutation({
    mutationFn: (userUpdateRequest: UserUpdateRequest) =>
      updateUser(userUpdateRequest),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      toast.success({
        title: formatMessage(messages.updateSuccess),
        description: formatMessage(messages.updateSuccessDescription),
      });
    },
    onError: (error: any) => {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
      toast.error({
        title: formatMessage(messages.updateError),
        description: formatMessage(messages.updateErrorDescription),
      });
      console.error("Profile edit error:", error);
    },
  });

  const onSubmit = async (formData: ProfileFormValues) => {
    const userUpdateRequest: UserUpdateRequest = {
      id: user?.id ?? null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age ? Number(formData.age) : undefined,
      gender: formData.gender,
      difficulty: formData.difficulty,
    };

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
          <Header title={formatMessage(messages.title)} />
          <ErrorText size="m">
            Failed to load user data. Please try again.
          </ErrorText>
          <Button onPress={() => refetch()}>Retry</Button>
        </Container>
      </SafeAreaWrapper>
    );
  }

  const difficultyOptions = [
    {
      label: formatMessage(messages.difficulty.easy),
      value: ActivityDifficulty.EASY,
    },
    {
      label: formatMessage(messages.difficulty.medium),
      value: ActivityDifficulty.MEDIUM,
    },
    {
      label: formatMessage(messages.difficulty.hard),
      value: ActivityDifficulty.HARD,
    },
  ];

  return (
    <SafeAreaWrapper>
      <Container>
        <Header title={formatMessage(messages.title)} />

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
            name="age"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  label={formatMessage(messages.age)}
                  placeholder="Enter your age"
                  value={value?.toString() ?? ""}
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
              <Select
                label={formatMessage(messages.gender)}
                value={value}
                options={Object.values(Gender).map((gender) => ({
                  label: formatMessage({
                    id: `profile.gender.${gender.toLowerCase()}`,
                    defaultMessage:
                      gender[0].toUpperCase() +
                      gender.substring(1).toLowerCase(),
                  }),
                  value: gender,
                }))}
                onValueChange={onChange}
                placeholder={formatMessage({
                  id: "profile.gender.placeholder",
                  defaultMessage: "Select gender",
                })}
                error={
                  errors.gender ? String(errors.gender.message) : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="difficulty"
            render={({ field: { onChange, value } }) => (
              <Select
                label={formatMessage(messages.difficulty)}
                value={value}
                options={difficultyOptions}
                onValueChange={onChange}
                placeholder={formatMessage({
                  id: "profile.difficulty.placeholder",
                  defaultMessage: "Select difficulty",
                })}
                error={
                  errors.difficulty
                    ? String(errors.difficulty.message)
                    : undefined
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
                <BaseText fontWeight="600">
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
