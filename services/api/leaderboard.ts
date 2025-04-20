import apiClient from "./client";
import { LeaderboardType } from "@/types/leaderboard/leaderboard-type";

export interface LeaderboardEntryDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender: string;
  totalSteps: number;
  position: number;
}

export const getLeaderboard = async (
  type: LeaderboardType
): Promise<LeaderboardEntryDto[]> => {
  const response = await apiClient.get<LeaderboardEntryDto[]>(`/leaderboard`, {
    params: { period: type },
  });
  return response.data;
};
