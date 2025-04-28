import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import styled from 'styled-components/native';
import {useIntl} from 'react-intl';
import {sendForgotPasswordEmail} from '@/services/api/auth';
import {ForgotPasswordRequest} from '@/types/auth/forgot-password-request';
import {useToast} from '@/components/ui';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import BaseText from '@/components/ui/BaseText';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import Header from './Header';
import {messages} from './messages';

// Styled components (reused from LoginScreen)
const Container = styled(View)`
    flex: 1;
    padding: 16px;
    gap: 16px;
`;

const InputWrapper = styled(View)`
    gap: 12px;
`;

const ButtonContent = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

const ForgotPasswordScreen = () => {
    const {formatMessage} = useIntl();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleForgotPassword = async () => {
        try {
            setIsLoading(true);
            await sendForgotPasswordEmail({email} as ForgotPasswordRequest);
            toast.success({
                title: formatMessage(messages.successSent),
                description: formatMessage(messages.successSentDescription),
            });
        } catch (error) {
            toast.error({
                title: formatMessage(messages.errorSent),
                description: formatMessage(messages.errorSentDescription),
            });
            console.error('Failed to send password reset email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaWrapper>
            <Container>
                <Header/>
                <InputWrapper>
                    <TextInput
                        placeholder="Enter your email here"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Button
                        onPress={handleForgotPassword}
                        style={{marginTop: 35}}
                        isDisabled={isLoading}
                    >
                        {isLoading ? (
                            <ButtonContent>
                                <ActivityIndicator size="small" color="white"/>
                                <BaseText color="white" fontWeight="600">
                                    {formatMessage(messages.sendResetLink)}
                                </BaseText>
                            </ButtonContent>
                        ) : (
                            formatMessage(messages.sendResetLink)
                        )}
                    </Button>
                </InputWrapper>
            </Container>
        </SafeAreaWrapper>
    );
};

export default ForgotPasswordScreen;
