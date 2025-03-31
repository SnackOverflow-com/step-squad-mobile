import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  // Add any other user properties that might be returned by the API
}

export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Login user with email and password
 * @param credentials The user login credentials
 * @returns A promise with the login response data
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    // Store the auth token in AsyncStorage
    await AsyncStorage.setItem("auth_token", response.data.token);

    return response.data;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Register a new user
 * @param credentials The user registration credentials
 * @returns A promise with the registration response data
 */
export const registerUser = async (
  credentials: RegisterCredentials
): Promise<LoginResponse> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    const response = await apiClient.post<LoginResponse>(
      "/auth/register",
      credentials
    );

    // Store the auth token in AsyncStorage
    await AsyncStorage.setItem("auth_token", response.data.token);

    return response.data;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Call logout endpoint if needed
    // await apiClient.post('/auth/logout');

    // Clear the auth token
    await AsyncStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Check if the user is already authenticated
 * @returns A boolean indicating if the user has a stored token
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return !!token;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

/**
 * Fetch the current user data
 * @returns The current user data
 */
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  } catch (error) {
    console.error("Fetch current user error:", error);
    throw error;
  }
};
