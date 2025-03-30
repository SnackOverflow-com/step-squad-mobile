import React from "react";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { useIntl } from "react-intl";
import { BaseText } from "@/components/ui";
import { messages } from "./messages";

const Container = styled.View`
  padding: 16px;
  gap: 4px;
`;

const Subtitle = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textSecondary};
`;

const Header = () => {
  const { formatMessage } = useIntl();

  return (
    <Container>
      <BaseText size="xl" fontWeight="700">
        {formatMessage(messages.welcome)}
      </BaseText>

      <Subtitle size="xs">{formatMessage(messages.subtitle)}</Subtitle>
    </Container>
  );
};

export default Header;
