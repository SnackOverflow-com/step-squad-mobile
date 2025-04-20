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
import { Gender, UserUpdateRequest } from "@/types";
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
  const toast = useToast();

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

  React.useEffect(() => {
    if (user) {
      reset({
        id: user.id ?? null,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        age: user.age ?? undefined,
        gender: user.gender ?? "UNSPECIFIED",
      } as UserUpdateRequest);
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
          <Header title={formatMessage(messages.title)} />
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
                options={Object.keys(Gender).map((gender) => ({
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
