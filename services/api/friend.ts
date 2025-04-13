import { ActivityResponse } from "@/types/activity/activity-response";
import apiClient from "./client";
import { User } from "@/types/user/user";

// Define the DTO types
export interface FriendSearchRequestDto {
  search: string;
}

export interface FriendResponseDto extends User {
  isFriend: boolean;
}

export interface FriendWithActivityResponseDto extends FriendResponseDto {
  todayStepsActivity?: ActivityResponse;
}

/**
 * Search for users to add as friends
 * @param search - The search query
 * @returns A promise that resolves to an array of user results
 */
export const searchUsers = async (
  query: string
): Promise<FriendResponseDto[]> => {
  const { data } = await apiClient.get<FriendResponseDto[]>("/friend/search", {
    params: { query },
  });
  return data;
};

/**
 * Add a user as a friend
 * @param friendId - The ID of the user to add as a friend
 * @returns A promise that resolves when the friend is added
 */
export const addFriend = async (friendId: number): Promise<void> => {
  await apiClient.put(`/friend/${friendId}`);
};

/**
 * Remove a friend
 * @param friendId - The ID of the friend to remove
 * @returns A promise that resolves when the friend is removed
 */
export const removeFriend = async (friendId: number): Promise<void> => {
  await apiClient.delete(`/friend/${friendId}`);
};

/**
 * Get all friends with their activities
 * @returns A promise that resolves to an array of friends with activities
 */
export const getFriendsWithActivities = async (): Promise<
  FriendWithActivityResponseDto[]
> => {
  const { data } =
    await apiClient.get<FriendWithActivityResponseDto[]>("/friend/list");
  return data;
};
