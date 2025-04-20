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
  errorTitle: {
    id: "screens.leaderboard.errorTitle",
    defaultMessage: "Error loading leaderboard",
  },
  errorContent: {
    id: "screens.leaderboard.errorContent",
    defaultMessage: "We couldn't load the leaderboard. Please try again later.",
  },
  empty: {
    id: "screens.leaderboard.empty",
    defaultMessage: "No data available",
  },
  emptyContent: {
    id: "screens.leaderboard.emptyContent",
    defaultMessage: "There are no steps recorded for this period yet.",
  },
});

export default messages;
