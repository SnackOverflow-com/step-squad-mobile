import React, { ComponentProps } from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";

import { DefaultTheme } from "styled-components";
import Button from "@/components/ui/Button";
import { useThemeContext } from "@/hooks/useThemeContext";
import { TrashIcon } from "lucide-react-native";
import { BaseText, TextInput } from "@/components/ui";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

// Local styled components
const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.background};
`;

// Apply alignment styles to the content container
Container.defaultProps = {
  contentContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
};

// Example of custom styled BaseText
const ErrorText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.error.main};
`;

const BrandText = styled(BaseText)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.main};
`;

const Separator = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.contrast[30]};
`;

const ButtonWrapper = styled(View)`
  width: 100%;
  gap: 8px;
  padding: 16px;
`;

const StyledButton = styled(Button)<ComponentProps<typeof Button>>`
  width: 100%;
`;

const StyledTrashIcon = styled(TrashIcon)`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.main};
`;

const HomeScreen = () => {
  const { toggleTheme } = useThemeContext();
  return (
    <SafeAreaWrapper>
      <Container>
        <BrandText weight="700" size="xl">
          Welcome to StepSquad
        </BrandText>

        <Separator />

        <BaseText weight="600" size="l">
          Font Demo and random bs components
        </BaseText>

        <BaseText weight="400">
          This is ManropeRegular font (weight 400)
        </BaseText>

        <BaseText weight="600">
          This is ManropeSemiBold font (weight 600)
        </BaseText>

        <BaseText weight="700">This is ManropeBold font (weight 700)</BaseText>

        <ErrorText>This is an error message with custom styling</ErrorText>

        <ButtonWrapper>
          <StyledButton
            variant="primary"
            size="l"
            onPress={() => toggleTheme()}
          >
            Disco!
          </StyledButton>
        </ButtonWrapper>

        <View>
          <Button variant="outline" size="s">
            <StyledTrashIcon />
          </Button>
        </View>

        <TextInput
          placeholder="Your precious name"
          label="Email"
          type="number"
          // isDisabled
          // error="This is an error"
          helperText="By entering your email, you agree to our terms and conditions"
          onChangeText={(text) => console.log(text)}
        />
      </Container>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
