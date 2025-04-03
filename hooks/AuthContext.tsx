import React, {createContext, ReactNode, useContext, useEffect, useState,} from "react";

import {
  checkAuth,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
} from "@/services/api/auth";
import {queryClient} from "@/services/queryClient";
import {UserRegisterRequest} from "@/types/user/user-register-request";
import {UserLoginRequest} from "@/types/user/user-login-request";

// Define the context type
interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userLoginRequest: UserLoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    register: (userRegisterRequest: UserRegisterRequest) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    login: async () => {
    },
    logout: async () => {
    },
    register: async () => {
    },
});

// Define props for the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({children}: AuthProviderProps) => {
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
    const login = async (userLoginRequest: UserLoginRequest) => {
        try {
            await apiLoginUser(userLoginRequest);
            setIsAuthenticated(true);
            // Invalidate user query to trigger a refetch when the hook is called
            queryClient.invalidateQueries({queryKey: ["currentUser"]});
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
            // Clear user data from cache
            queryClient.removeQueries({queryKey: ["currentUser"]});
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    // Function to handle registration
    const register = async (userRegisterRequest: UserRegisterRequest) => {
        try {
            await apiRegisterUser(userRegisterRequest);
            setIsAuthenticated(true);
            // Invalidate user query to trigger a refetch when the hook is called
            queryClient.invalidateQueries({queryKey: ["currentUser"]});
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    // Provide the auth context values to children
    return (
        <AuthContext.Provider
            value={{isAuthenticated, isLoading, login, logout, register}}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
