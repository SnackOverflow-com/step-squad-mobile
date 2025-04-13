import { defineMessages } from "react-intl";

const messages = defineMessages({
  title: {
    id: "friends.title",
    defaultMessage: "Friends",
  },
  empty: {
    id: "friends.empty",
    defaultMessage: "You don't have any friends yet",
  },
  removeFriend: {
    id: "friend.removeFriend",
    defaultMessage: "Remove friend",
  },
  errorTitle: {
    id: "friends.error.title",
    defaultMessage: "Error",
  },
  errorContent: {
    id: "friends.error.content",
    defaultMessage: "Failed to load friends",
  },
  emptyContent: {
    id: "friends.empty.content",
    defaultMessage: "Add friends to your list",
  },
  friendCountSingular: {
    id: "friends.count.singular",
    defaultMessage: "You have 1 friend",
  },
  friendCountPlural: {
    id: "friends.count.plural",
    defaultMessage: "You have {count} friends",
  },
  successRemove: {
    id: "friends.remove.success.title",
    defaultMessage: "Success",
  },
  successRemoveDescription: {
    id: "friends.remove.success.description",
    defaultMessage: "Friend removed successfully",
  },
  errorRemove: {
    id: "friends.remove.error.title",
    defaultMessage: "Error",
  },
  errorRemoveDescription: {
    id: "friends.remove.error.description",
    defaultMessage: "Failed to remove friend",
  },
  successAdd: {
    id: "friends.add.success.title",
    defaultMessage: "Success",
  },
  successAddDescription: {
    id: "friends.add.success.description",
    defaultMessage: "Friend added successfully",
  },
  errorAdd: {
    id: "friends.add.error.title",
    defaultMessage: "Error",
  },
  errorAddDescription: {
    id: "friends.add.error.description",
    defaultMessage: "Failed to add friend",
  },
  // AddFriends component messages
  searchPlaceholder: {
    id: "friends.addFriends.searchPlaceholder",
    defaultMessage: "Search friends..",
  },
  add: {
    id: "friends.addFriends.add",
    defaultMessage: "Add",
  },
  noResults: {
    id: "friends.addFriends.noResults",
    defaultMessage: "No users found",
  },
  searchTitle: {
    id: "friends.addFriends.searchTitle",
    defaultMessage: "Search friend",
  },
  searchContent: {
    id: "friends.addFriends.searchContent",
    defaultMessage: "Start typing to search for friends",
  },
  confirmRemoveTitle: {
    id: "friends.remove.confirm.title",
    defaultMessage: "Remove friend",
  },
  confirmRemoveMessage: {
    id: "friends.remove.confirm.message",
    defaultMessage: "Are you sure you want to remove {name} from your friends?",
  },
  cancel: {
    id: "common.cancel",
    defaultMessage: "Cancel",
  },
  confirm: {
    id: "common.confirm",
    defaultMessage: "Confirm",
  },
});

export default messages;
