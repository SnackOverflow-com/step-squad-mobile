import React from "react";
import { View, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";
import { FormattedDate, useIntl } from "react-intl";

import { BaseText, Dropdown } from "@/components/ui";
import { useUser } from "@/hooks";
import messages from "./messages";
import Avatar from "@/components/ui/Avatar";
import { LogOutIcon, UserIcon } from "lucide-react-native";

const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NotificationContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const StyledBaseText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

// Custom styled components for dropdown items
const CustomItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
`;

const IconPlaceholder = styled(View)`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({
    theme,
    color,
  }: {
    theme: DefaultTheme;
    color: string;
  }) => color};
  margin-right: 8px;
`;

const StyledUserIcon = styled(UserIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const StyledLogoutIcon = styled(LogOutIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
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

        <Dropdown position="bottom">
          <Dropdown.Trigger>
            <Avatar name={user?.firstName || ""} isOnline={true} />
          </Dropdown.Trigger>

          {/* Standard item with label */}
          <Dropdown.Item
            label={formatMessage(messages.profile)}
            icon={<StyledUserIcon />}
            onPress={() => console.log("Profile")}
          />

          <Dropdown.Divider />

          <Dropdown.Item
            label={formatMessage(messages.logout)}
            icon={<StyledLogoutIcon />}
            onPress={() => console.log("Logout")}
          />
        </Dropdown>
      </NotificationContainer>
    </Container>
  );
};

export default Header;
