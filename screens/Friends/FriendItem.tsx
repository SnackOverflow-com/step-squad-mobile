import { Avatar, BaseText } from "@/components/ui";
import { genderOptions } from "@/types/user/gender";
import { User } from "@/types/user/user";
import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { View } from "react-native";
import { DefaultTheme } from "styled-components";
import styled from "styled-components/native";
import { FriendWithActivityResponseDto } from "@/services/api/friend";
import { LinearGradient } from "expo-linear-gradient";

const messages = defineMessages({
  fullName: {
    id: "friend.fullName",
    defaultMessage: "{firstName} {lastName}",
  },
  stepsDoneToday1: {
    id: "friend.stepsDoneToday1",
    defaultMessage: "Done <bold>{steps}/{goal}</bold> steps today {emoji}",
  },
  stepsDoneToday2: {
    id: "friend.stepsDoneToday2",
    defaultMessage:
      "Walked <bold>{steps}</bold> out of <bold>{goal}</bold> steps {emoji}",
  },
  stepsDoneToday3: {
    id: "friend.stepsDoneToday3",
    defaultMessage:
      "<bold>{steps}</bold> steps so far. Goal: <bold>{goal}</bold> {emoji}",
  },
  stepsDoneToday4: {
    id: "friend.stepsDoneToday4",
    defaultMessage: "Progress: <bold>{steps}/{goal}</bold> steps {emoji}",
  },
  stepsDoneToday5: {
    id: "friend.stepsDoneToday5",
    defaultMessage:
      "Today's count: <bold>{steps}</bold> of <bold>{goal}</bold> {emoji}",
  },
});

interface ContainerProps {
  theme: DefaultTheme;
  backgroundColor?: string;
}

const ContainerBase = styled(View)<ContainerProps>`
  flex-direction: row;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  justify-content: space-between;
  background-color: ${({ theme, backgroundColor }: ContainerProps) =>
    backgroundColor || theme.card};
  gap: 16px;
`;

const GradientContainer = styled(LinearGradient)`
  flex-direction: row;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  justify-content: space-between;
  gap: 16px;
`;

const UserInfo = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const UserDetails = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const emojiGenerator = (steps: number, goal: number) => {
  if (steps >= goal) return "🥵";
  if (steps >= goal * 0.75) return "😎";
  if (steps >= goal * 0.5) return "🙂";
  if (steps >= goal * 0.25) return "😏";
  return "🥶";
};

// Array of step message keys for random selection
const stepMessageKeys = [
  "stepsDoneToday1",
  "stepsDoneToday2",
  "stepsDoneToday3",
  "stepsDoneToday4",
  "stepsDoneToday5",
] as const;

type StepMessageKey = (typeof stepMessageKeys)[number];

// Get a random message key
const getRandomMessageKey = (): StepMessageKey => {
  const randomIndex = Math.floor(Math.random() * stepMessageKeys.length);
  return stepMessageKeys[randomIndex];
};

const FriendItem = ({
  user,
  action,
  descriptionType = "steps",
  backgroundColor,
  gradientColors,
  descriptionValue,
}: {
  user: User | FriendWithActivityResponseDto;
  action?: React.ReactNode;
  descriptionType?: "steps" | "ageGender" | "value";
  backgroundColor?: string;
  gradientColors?: string[];
  descriptionValue?: React.ReactNode;
}) => {
  const { formatMessage } = useIntl();

  // Get a random message key but keep it stable for this component instance
  // Using useMemo with empty dependency array ensures it's only calculated once
  const messageKey = useMemo(() => getRandomMessageKey(), []);

  if (!user) return null;

  // Extract activity data if available
  const todayActivity =
    "todayStepsActivity" in user ? user.todayStepsActivity : undefined;
  const STEPS = todayActivity?.quantity || 0;
  const GOAL = todayActivity?.goal || 10000;

  // For description type "ageGender"
  const ageAndGender = () => {
    const parts = [];
    if (user.age) parts.push(`${user.age} years old`);
    if (user.gender && user.gender !== "UNSPECIFIED") {
      const genderLabel = genderOptions.find(
        (g) => g.value === user.gender
      )?.label;
      if (genderLabel) parts.push(genderLabel);
    }
    return parts.join(", ");
  };

  const renderContent = () => (
    <>
      <UserInfo>
        <Avatar name={user.firstName} />

        <UserDetails>
          <BaseText size="m">
            {formatMessage(messages.fullName, {
              firstName: user.firstName,
              lastName: user.lastName,
            })}
          </BaseText>

          {descriptionType === "steps" ? (
            <BaseText size="xs" color={70}>
              {formatMessage(messages[messageKey], {
                steps: STEPS,
                goal: GOAL,
                emoji: emojiGenerator(STEPS, GOAL),
                bold: (chunk) => (
                  <BaseText size="xs" fontWeight="600">
                    {chunk}
                  </BaseText>
                ),
              })}
            </BaseText>
          ) : descriptionType === "ageGender" ? (
            <BaseText size="xs" color={70}>
              {ageAndGender()}
            </BaseText>
          ) : (
            descriptionValue
          )}
        </UserDetails>
      </UserInfo>

      {action}
    </>
  );

  if (gradientColors && gradientColors.length >= 2) {
    return (
      <GradientContainer
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {renderContent()}
      </GradientContainer>
    );
  }

  return (
    <ContainerBase backgroundColor={backgroundColor}>
      {renderContent()}
    </ContainerBase>
  );
};

export default FriendItem;
