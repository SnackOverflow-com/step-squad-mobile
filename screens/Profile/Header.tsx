import React from "react";
import styled from "styled-components/native";
import { useIntl } from "react-intl";
import { BaseText } from "@/components/ui";
import { messages } from "./messages";

const Container = styled.View`
  padding: 16px;
  gap: 4px;
`;

const Header = () => {
  const { formatMessage } = useIntl();

  return (
    <Container>
      <BaseText size="xl" fontWeight="700">
        {formatMessage(messages.title)}
      </BaseText>
    </Container>
  );
};

export default Header;
