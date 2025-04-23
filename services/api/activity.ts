import { Activity } from "@/types/activity/activity";
import apiClient from "@/services/api/client";
import { ActivityUpdateRequest } from "@/types/activity/activity-update-request";
import { ActivityType } from "@/types/activity/activity-type";
import { ActivityHistoryResponse } from "@/types/activity/activity-history-response";
import { ActivityTimeRange } from "@/types/activity/activity-time-range";

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

/**
 * Get activity history
 * @param type The type of activity to fetch history for
 * @param count The number of time units to fetch (defaults to 5)
 * @param timeRange The time unit to use (days, weeks, months) (defaults to DAYS)
 * @returns The activity history data
 */
export const getActivityHistory = async (
  type: ActivityType,
  count: number = 5,
  timeRange: ActivityTimeRange = ActivityTimeRange.DAYS
): Promise<ActivityHistoryResponse> => {
  try {
    const response = await apiClient.get<ActivityHistoryResponse>(
      `/activity/history`,
      {
        params: { type, count, timeRange },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get activity history error:", error);
    throw error;
  }
};
