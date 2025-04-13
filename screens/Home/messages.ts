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
});

export default messages;
