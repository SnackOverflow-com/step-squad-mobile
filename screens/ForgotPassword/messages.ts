import {defineMessages} from "react-intl";

export const messages = defineMessages({
    successSent: {
        id: "forgotPassword.successSent",
        defaultMessage: "Success",
    },
    successSentDescription: {
        id: "forgotPassword.successSentDescription",
        defaultMessage: "Password reset email sent. Please check your email.",
    },
    emailSent: {
        id: "forgotPassword.emailSent",
        defaultMessage: "ForgotPassword reset email sent",
    },
    errorSent: {
        id: "forgotPassword.error",
        defaultMessage: "Error",
    },

    errorSentDescription: {
        id: "forgotPassword.error",
        defaultMessage: "Something went wrong while sending email",
    },
    subtitle: {
        id: "forgotPassword.subtitle",
        defaultMessage: "Please enter the email you of your account",
    },
    sendResetLink: {
        id: "forgotPassword.sendResetLink",
        defaultMessage: "Send link",
    }
});
