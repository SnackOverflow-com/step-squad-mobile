import apiClient from "./client";
import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";
import { ActivityDifficulty } from "@/types/activity/activity-difficulty";
export interface LeaderboardEntryDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender: string;
  totalSteps: number;
  position: number;
  difficulty: ActivityDifficulty;
}

export const getLeaderboard = async (
  type: LeaderboardType
): Promise<LeaderboardEntryDto[]> => {
  const response = await apiClient.get<LeaderboardEntryDto[]>(`/leaderboard`, {
    params: { period: type },
  });
  return response.data;
};
