import React from "react";
import { Pressable, View } from "react-native";

import { BaseText, Button } from "@/components/ui";
import { useUser } from "@/hooks";
import { FormattedDate, useIntl } from "react-intl";
import messages from "./messages";
import styled from "styled-components/native";
import { BellIcon } from "lucide-react-native";
import { DefaultTheme } from "styled-components";
const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NotificationContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StyledBaseText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

const StyledBellIcon = styled(BellIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const StyledButton = styled(Button)`
  padding: 6px;
`;

const Header = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();

  return (
    <Container>
      <BaseText size="l" fontWeight="700">
        {formatMessage(messages.welcome, { name: user?.firstName })}
      </BaseText>

      <NotificationContainer>
        <StyledBaseText size="s">
          <FormattedDate
            value={new Date()}
            day="numeric"
            month="long"
            year="numeric"
          />
        </StyledBaseText>

        <StyledButton variant="ghost" size="s">
          <StyledBellIcon />
        </StyledButton>
      </NotificationContainer>
    </Container>
  );
};

export default Header;
