import { Gender } from "@/types/user/gender";
import { Activity } from "@/types/activity/activity";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender?: Gender;
  activities: Activity[];
}
