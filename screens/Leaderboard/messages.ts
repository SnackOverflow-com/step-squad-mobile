import { defineMessages } from "react-intl";

const messages = defineMessages({
  title: {
    id: "screens.leaderboard.title",
    defaultMessage: "Leaderboard",
  },
  userPosition: {
    id: "screens.leaderboard.userPosition",
    defaultMessage: "Your position: {position}{suffix}",
  },
  youIndicator: {
    id: "screens.leaderboard.youIndicator",
    defaultMessage: "(you)",
  },
  stepsText: {
    id: "screens.leaderboard.stepsText",
    defaultMessage: "{steps} steps",
  },
  positionPrefix: {
    id: "screens.leaderboard.positionPrefix",
    defaultMessage: "#{position}",
  },
});

export default messages;
