import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth event system to notify when token expires
type AuthEventListener = () => void;
const authEvents = {
  listeners: new Set<AuthEventListener>(),
  subscribe: (listener: AuthEventListener) => {
    authEvents.listeners.add(listener);
    return () => {
      authEvents.listeners.delete(listener);
    };
  },
  notifyTokenExpired: () => {
    authEvents.listeners.forEach((listener) => listener());
  },
};

// Export the auth events
export { authEvents };

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
    // First check if we have a response object before trying to access status
    // Error might be network-related and not have a response
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;

      // Only handle 401 errors that come from an actual API response (token expired)
      // Don't handle 401 that might come from misconfiguration or other issues
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Remove the token
          await AsyncStorage.removeItem("auth_token");

          // Notify listeners that the token has expired
          authEvents.notifyTokenExpired();

          console.log("Received 401 Unauthorized - Token expired or invalid");
        } catch (refreshError) {
          // If anything fails, still remove the token
          await AsyncStorage.removeItem("auth_token");
          authEvents.notifyTokenExpired();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
