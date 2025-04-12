import { Avatar, BaseText, Button, Dropdown } from "@/components/ui";
import { useThemeContext } from "@/hooks";
import { User } from "@/types/user/user";
import { EllipsisVerticalIcon, TrashIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { View } from "react-native";
import { DefaultTheme } from "styled-components";
import styled from "styled-components/native";

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
  removeFriend: {
    id: "friend.removeFriend",
    defaultMessage: "Remove Friend",
  },
});

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  justify-content: space-between;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.card};
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

// Function to get a random message key
const getRandomMessageKey = (): StepMessageKey => {
  const randomIndex = Math.floor(Math.random() * stepMessageKeys.length);
  return stepMessageKeys[randomIndex];
};

const FriendItem = ({ user }: { user: User }) => {
  const { formatMessage } = useIntl();
  const { theme } = useThemeContext();

  // Get a random message key but keep it stable for this component instance
  // Using useMemo with empty dependency array ensures it's only calculated once
  const messageKey = useMemo(() => getRandomMessageKey(), []);

  if (!user) return null;

  const STEPS = 245;
  const GOAL = 10000;

  return (
    <Container>
      <UserInfo>
        <Avatar name={user.firstName} />

        <UserDetails>
          <BaseText size="m">
            {formatMessage(messages.fullName, {
              firstName: user.firstName,
              lastName: user.lastName,
            })}
          </BaseText>

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
        </UserDetails>
      </UserInfo>

      <Dropdown position="bottom">
        <Dropdown.Trigger>
          <Button variant="ghost" size="s">
            <EllipsisVerticalIcon color={theme.text} />
          </Button>
        </Dropdown.Trigger>

        <Dropdown.Item
          label={formatMessage(messages.removeFriend)}
          icon={<TrashIcon />}
          onPress={() => {
            /* TODO: Implement remove friend */
          }}
        />
      </Dropdown>
    </Container>
  );
};

export default FriendItem;
