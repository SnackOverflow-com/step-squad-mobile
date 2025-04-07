import { ActivityType } from "@/types/activity/activity-type";
import { ActivityDifficulty } from "@/types/activity/activity-difficulty";

export interface Activity {
  id: number;
  userId: number;
  date: Date;
  quantity: number;
  goal: number;
  type: ActivityType;
  difficulty: ActivityDifficulty;
  isGoalReached: boolean;
}
