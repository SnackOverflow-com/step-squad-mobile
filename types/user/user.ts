import {Gender} from "@/types/user/gender";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    gender?: Gender
}