import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components";
import { FormattedDate, useIntl } from "react-intl";
import { useRouter } from "expo-router";

import { BaseText, Dropdown } from "@/components/ui";
import { useAuth, useUser } from "@/hooks";
import Avatar from "@/components/ui/Avatar";
import { LogOutIcon, UserIcon } from "lucide-react-native";
import { messages } from "./messages";

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

const StyledUserIcon = styled(UserIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const StyledLogoutIcon = styled(LogOutIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const Header = ({ title }: { title: string }) => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Container>
      <BaseText size="l" fontWeight="700">
        {title}
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
            onPress={() => router.push("/profile")}
          />

          <Dropdown.Divider />

          <Dropdown.Item
            label={formatMessage(messages.logout)}
            icon={<StyledLogoutIcon />}
            onPress={() => handleLogout()}
          />
        </Dropdown>
      </NotificationContainer>
    </Container>
  );
};

export default Header;
