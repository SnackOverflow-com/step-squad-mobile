import {Activity} from "@/types/activity/activity";
import apiClient from "@/services/api/client";
import {ActivityUpdateRequest} from "@/types/activity/activity-update-request";

/**
 * Get activity
 * @returns The activity data
 */
export const getActivity = async (): Promise<Activity> => {
  try {
    const response = await apiClient.get<Activity>(`/activity`);

    return response.data;
  } catch (error) {
    console.error("Get activity error:", error);
    throw error;
  }
};

/**
 * Update activity
 * @returns The updated activity data
 */
export const updateActivity = async (
  activityUpdateRequest: ActivityUpdateRequest
): Promise<Activity> => {
  try {
    const response = await apiClient.put<Activity>(`/activity`);

    return response.data;
  } catch (error) {
    console.error("Update activity error:", error);
    throw error;
  }
};
