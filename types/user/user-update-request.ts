import { Gender } from "@/types/user/gender";

export interface UserUpdateRequest {
  id: number | null;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: Gender;
}
