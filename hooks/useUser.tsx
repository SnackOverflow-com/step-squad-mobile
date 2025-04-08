import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./AuthContext";
import { User } from "@/types/user/user";
import { fetchCurrentUser } from "@/services/api/user";

/**
 * Hook for fetching and caching the current user data
 * @returns An object containing the user data, loading state, and error state
 */
export const useUser = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated, // Only run the query if the user is authenticated
    retry: false, // Don't retry on failure to avoid multiple 401 errors
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
};
