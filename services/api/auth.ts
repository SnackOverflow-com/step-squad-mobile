import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./client";
import { UserRegisterRequest } from "@/types/user/user-register-request";
import { UserLoginRequest } from "@/types/user/user-login-request";
import { UserLoginResponse } from "@/types/user/user-login-response";
import { verifyStoredToken } from "../utils/jwt";
import {ForgotPasswordRequest} from "@/types/auth/forgot-password-request";
import {ResetPasswordRequest} from "@/types/auth/reset-password-request";

/**
 * Login user with email and password
 * @param credentials The user login credentials
 * @returns A promise with the login response data
 */
export const loginUser = async (
  credentials: UserLoginRequest
): Promise<UserLoginResponse> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    const response = await apiClient.post<UserLoginResponse>(
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
 * @param userRegisterRequest The user registration request
 * @returns A promise with the registration response data
 */
export const registerUser = async (
  userRegisterRequest: UserRegisterRequest
): Promise<UserLoginResponse> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    const response = await apiClient.post<UserLoginResponse>(
      "/auth/register",
      userRegisterRequest
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
 * @returns A boolean indicating if the user has a valid token
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    // Use our JWT utility to verify if the token exists and is not expired
    return await verifyStoredToken();
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const sendForgotPasswordEmail = async (
    forgotPasswordRequest: ForgotPasswordRequest
): Promise<void> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    await apiClient.post<ForgotPasswordRequest>(
        "/auth/forgot-password",
        forgotPasswordRequest
    );
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

export const sendResetPasswordRequest = async (
    resetPasswordRequest: ResetPasswordRequest
): Promise<void> => {
  try {
    // This is a placeholder - replace with your actual API endpoint
    await apiClient.post<ResetPasswordRequest>(
        "/auth/reset-password",
        resetPasswordRequest
    );
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}
