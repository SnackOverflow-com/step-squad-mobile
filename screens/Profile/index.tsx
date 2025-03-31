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

// Form validation schema
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

const genderOptions = [
  { label: "Unspecified", value: "UNSPECIFIED" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const ProfileScreen = () => {
  const { formatMessage } = useIntl();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      gender: "UNSPECIFIED",
    },
    resolver: zodResolver(profileSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (formData: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const submitData = {
        ...formData,
        age: formData.age === "" ? undefined : Number(formData.age),
      };
      //TODO: Add call to backend to save the changed data
      // await updateProfile(submitData);
    } catch (error: any) {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
      console.error("Profile edit error:", error);
    } finally {
      setIsLoading(false);
    }
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
                  label={formatMessage({
                    id: "profile.age",
                    defaultMessage: "Age",
                  })}
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
                label={formatMessage({
                  id: "profile.gender",
                  defaultMessage: "Gender",
                })}
                value={value}
                items={genderOptions.map((option) => ({
                  ...option,
                  label: formatMessage({
                    id: `gender.${option.value.toLowerCase()}`,
                    defaultMessage: option.label,
                  }),
                }))}
                onValueChange={onChange}
                placeholder="Select gender"
                error={
                  errors.gender ? String(errors.gender.message) : undefined
                }
              />
            )}
          />

          {errors.root && (
            <ErrorText size="xs">{errors.root.message}</ErrorText>
          )}
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
                {formatMessage(messages.save)}
              </BaseText>
            </ButtonContent>
          ) : (
            formatMessage(messages.save)
          )}
        </Button>
      </Container>
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;
