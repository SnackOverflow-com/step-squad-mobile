import { defineMessages } from "react-intl";

export const messages = defineMessages({
  welcome: {
    id: "register.welcome",
    defaultMessage: "Join StepSquad 👋",
  },
  subtitle: {
    id: "register.subtitle",
    defaultMessage: "Create an account to start your fitness journey",
  },
  firstName: {
    id: "register.firstName",
    defaultMessage: "First name",
  },
  firstNamePlaceholder: {
    id: "register.firstName.placeholder",
    defaultMessage: "John",
  },
  lastName: {
    id: "register.lastName",
    defaultMessage: "Last name",
  },
  lastNamePlaceholder: {
    id: "register.lastName.placeholder",
    defaultMessage: "Doe",
  },
  email: {
    id: "register.email",
    defaultMessage: "Email",
  },
  password: {
    id: "register.password",
    defaultMessage: "Password",
  },
  needHelp: {
    id: "register.needHelp",
    defaultMessage: "Need help?",
  },
  register: {
    id: "register.register",
    defaultMessage: "Register",
  },
  alreadyHaveAccount: {
    id: "register.alreadyHaveAccount",
    defaultMessage: "Already have an account? <link>Login here.</link>",
  },
});
