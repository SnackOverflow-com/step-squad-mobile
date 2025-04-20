import { Gender } from "@/types/user/gender";
import { ActivityDifficulty } from "@/types/activity/activity-difficulty";

export interface UserUpdateRequest {
  id: number | null;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: Gender;
  difficulty: ActivityDifficulty;
}
