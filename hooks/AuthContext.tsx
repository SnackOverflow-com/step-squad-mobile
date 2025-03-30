import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
  checkAuth,
  LoginCredentials,
  RegisterCredentials,
} from "@/services/api/auth";

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthed = await checkAuth();
        setIsAuthenticated(isAuthed);
      } catch (error) {
        console.error("Auth verification error:", error);
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
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await apiLogoutUser();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Function to handle registration
  const register = async (credentials: RegisterCredentials) => {
    try {
      await apiRegisterUser(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Provide the auth context values to children
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
