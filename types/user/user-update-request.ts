import {Gender} from "@/types/user/gender";

export interface UserUpdateRequest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    gender?: Gender
}