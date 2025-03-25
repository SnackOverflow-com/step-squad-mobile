import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  register: () => {},
});

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle login
  const login = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Function to handle registration
  const register = () => {
    setIsAuthenticated(true);
  };

  // Provide the auth context values to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
