import React from "react";
import styled, {DefaultTheme} from "styled-components/native";
import {useIntl} from "react-intl";
import {BaseText} from "@/components/ui";
import {messages} from "./messages";

const Container = styled.View`
    padding: 16px;
    gap: 4px;
`;

const Subtitle = styled(BaseText)`
    color: ${({theme}: { theme: DefaultTheme }) => theme.textSecondary};
`;

const Header = () => {
    const {formatMessage} = useIntl();

    return (
        <Container>
            <Subtitle size="l">{formatMessage(messages.subtitle)}</Subtitle>
        </Container>
    );
};

export default Header;
