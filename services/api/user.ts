import { User } from "@/types/user/user";
import apiClient from "@/services/api/client";
import { UserUpdateRequest } from "@/types/user/user-update-request";

/**
 * Fetch the current user data
 * @returns The current user data
 */
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/user/me`);
    return response.data;
  } catch (error) {
    console.error("Fetch current user error:", error);
    throw error;
  }
};

/**
 * Update current user data
 * @returns The updated current user data
 */
export const updateUser = async (
  userUpdateRequest: UserUpdateRequest
): Promise<User> => {
  try {
    const response = await apiClient.patch<User>(`/user`, userUpdateRequest);

    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};
