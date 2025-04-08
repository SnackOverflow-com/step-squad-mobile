import { User } from "@/types/user/user";

export interface UserLoginResponse {
  token: string;
  user: User;
}
