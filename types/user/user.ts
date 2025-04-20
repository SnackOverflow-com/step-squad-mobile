import { Gender } from "@/types/user/gender";
import { Activity } from "@/types/activity/activity";
import { ActivityDifficulty } from "@/types/activity/activity-difficulty";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender?: Gender;
  difficulty: ActivityDifficulty;
  activities: Activity[];
}
