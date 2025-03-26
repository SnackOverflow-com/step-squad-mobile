import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get the token from storage
    const token = await AsyncStorage.getItem("auth_token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response scenarios
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401) and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // You could implement token refresh logic here
        // const refreshToken = await AsyncStorage.getItem('refresh_token');
        // const response = await refreshTokenApiCall(refreshToken);
        // await AsyncStorage.setItem('auth_token', response.data.token);
        // Retry the original request with the new token
        // originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, log out the user
        await AsyncStorage.removeItem("auth_token");
        // You might want to redirect to login or dispatch a logout action here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
