import { ActivityType } from "./activity-type";
import { ActivityDifficulty } from "./activity-difficulty";

export interface ActivityResponse {
  id: number;
  date: string;
  quantity: number;
  goal: number;
  type: ActivityType;
  difficulty: ActivityDifficulty;
  isGoalReached: boolean;
}
