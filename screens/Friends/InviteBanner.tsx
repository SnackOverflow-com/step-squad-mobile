import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { HeartHandshakeIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BaseText } from "@/components/ui";
import { useThemeContext } from "@/hooks";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  title: {
    id: "friends.inviteBanner.title",
    defaultMessage: "Invite your buddies",
  },
  subtitle: {
    id: "friends.inviteBanner.subtitle",
    defaultMessage: "Add friends and earn rewards!",
  },
});

const StyledLinearGradient = styled(LinearGradient)`
  flex-direction: row;
  gap: 20px;
  padding: 16px;
  border-radius: 16px;
  align-items: center;
`;

const StyledBaseText = styled(BaseText)`
  color: white;
`;

const TextWrapper = styled(View)`
  flex: 1;
`;

const InviteBanner = () => {
  const { theme } = useThemeContext();
  const { formatMessage } = useIntl();

  return (
    <StyledLinearGradient
      colors={[theme.error.main, theme.primary.main]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <HeartHandshakeIcon size={64} color="white" />

      <TextWrapper>
        <StyledBaseText size="xxl">
          {formatMessage(messages.title)}
        </StyledBaseText>

        <StyledBaseText size="s">
          {formatMessage(messages.subtitle)}
        </StyledBaseText>
      </TextWrapper>
    </StyledLinearGradient>
  );
};

export default InviteBanner;
