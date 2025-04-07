import { defineMessages } from "react-intl";

const messages = defineMessages({
  welcome: {
    id: "home.welcome",
    defaultMessage: "Hi, {name}!",
  },
  dailyActivity: {
    id: "home.dailyActivity",
    defaultMessage: "Daily activity",
  },
  stepGoal: {
    id: "home.stepGoal",
    defaultMessage: "Step goal: {goal}",
  },
  requestPermission: {
    id: "home.requestPermission",
    defaultMessage: "Request step counting permission",
  },
  profile: {
    id: "home.profile",
    defaultMessage: "My profile",
  },
  settings: {
    id: "home.settings",
    defaultMessage: "Settings",
  },
  logout: {
    id: "home.logout",
    defaultMessage: "Logout",
  },
});

export default messages;
