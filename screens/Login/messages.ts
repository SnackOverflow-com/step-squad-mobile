import { defineMessages } from "react-intl";

export const messages = defineMessages({
  welcome: {
    id: "login.welcome",
    defaultMessage: "Welcome to StepSquad 👋",
  },
  subtitle: {
    id: "login.subtitle",
    defaultMessage: "Login to access your account and continue your journey",
  },
  email: {
    id: "login.email",
    defaultMessage: "Email",
  },
  emailPlaceholder: {
    id: "login.emailPlaceholder",
    defaultMessage: "Enter email here",
  },
  password: {
    id: "login.password",
    defaultMessage: "Password",
  },
  passwordPlaceholder: {
    id: "login.passwordPlaceholder",
    defaultMessage: "Enter password here",
  },
  forgotPassword: {
    id: "login.forgotPassword",
    defaultMessage: "Forgot password",
  },
  needHelp: {
    id: "login.needHelp",
    defaultMessage: "Need help?",
  },
  login: {
    id: "login.login",
    defaultMessage: "Login",
  },
  dontHaveAccount: {
    id: "login.dontHaveAccount",
    defaultMessage: "Don't have an account? <link>Register here.</link>",
  },
});
