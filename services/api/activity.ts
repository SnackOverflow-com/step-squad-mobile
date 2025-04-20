import { Activity } from "@/types/activity/activity";
import apiClient from "@/services/api/client";
import { ActivityUpdateRequest } from "@/types/activity/activity-update-request";
import { ActivityType } from "@/types/activity/activity-type";

/**
 * Get activity
 * @param type The type of activity to fetch
 * @returns The activity data
 */
export const getActivity = async (type: ActivityType): Promise<Activity> => {
  try {
    const response = await apiClient.get<Activity>(`/activity`, {
      params: { type },
    });

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
    const response = await apiClient.patch<Activity>(
      `/activity`,
      activityUpdateRequest
    );

    return response.data;
  } catch (error) {
    console.error("Update activity error:", error);
    throw error;
  }
};
