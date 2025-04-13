import apiClient from "./client";
import { User } from "@/types/user/user";

// Define the DTO types
export interface FriendSearchRequestDto {
  search: string;
}

export interface FriendResponseDto extends User {
  isFriend: boolean;
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
 * @param userId - The ID of the user to add as a friend
 * @returns A promise that resolves when the friend is added
 */
export const addFriend = async (userId: number): Promise<void> => {
  await apiClient.post("/friend", { userId });
};

/**
 * Remove a friend
 * @param userId - The ID of the friend to remove
 * @returns A promise that resolves when the friend is removed
 */
export const removeFriend = async (userId: number): Promise<void> => {
  await apiClient.delete(`/friend/${userId}`);
};
