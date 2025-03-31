import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
  checkAuth,
  LoginCredentials,
  RegisterCredentials,
} from "@/services/api/auth";
import { queryClient } from "@/services/queryClient";
import { authEvents } from "@/services/api/client";
import { verifyStoredToken } from "@/services/utils/jwt";

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  validateSession: () => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  validateSession: async () => false,
});

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to validate the current session
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const isValid = await verifyStoredToken();
      setIsAuthenticated(isValid);
      return isValid;
    } catch (error) {
      console.error("Session validation error:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Function to handle logout
  const logout = async () => {
    try {
      await apiLogoutUser();
      setIsAuthenticated(false);
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Subscribe to token expiration events
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(() => {
      // When token expires, update authentication state and clear user data
      setIsAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      console.log("Token expired - user logged out automatically");
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Use our enhanced checkAuth function that validates token expiration
        const isAuthed = await checkAuth();
        setIsAuthenticated(isAuthed);

        if (isAuthed) {
          console.log("User authenticated with valid token");
        } else {
          console.log("No valid authentication token found");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Function to handle login
  const login = async (credentials: LoginCredentials) => {
    try {
      await apiLoginUser(credentials);
      setIsAuthenticated(true);
      // Invalidate user query to trigger a refetch when the hook is called
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Function to handle registration
  const register = async (credentials: RegisterCredentials) => {
    try {
      await apiRegisterUser(credentials);
      setIsAuthenticated(true);
      // Invalidate user query to trigger a refetch when the hook is called
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Provide the auth context values to children
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        validateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
