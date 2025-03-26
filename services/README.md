# Step Squad Mobile - API Services

This directory contains the API services for the Step Squad Mobile app. It includes client configuration, authentication services, and React Query setup.

## Directory Structure

```
services/
├── api/
│   ├── client.ts          # Axios client setup with interceptors
│   ├── auth.ts            # Authentication API endpoints
│   └── ...                # Other API domain files
├── queryClient.tsx        # React Query client configuration
└── README.md              # This file
```

## Environment Variables

The app uses Expo's environment variables system. Environment variables are stored in a `.env` file in the project root and must be prefixed with `EXPO_PUBLIC_` to be accessible in the client code.

Current environment variables:

- `EXPO_PUBLIC_API_BASE_URL`: Base URL for the API server

To set up the environment:

1. Copy the `.env.example` file to `.env` in your project root:

   ```bash
   cp .env.example .env
   ```

2. Update the values in the `.env` file for your environment.

### In Development

Environment variables are automatically loaded from the `.env` file when using Expo CLI:

```bash
npx expo start
```

### In Production

For production builds using EAS, you can:

- Upload the `.env` file with your build
- Set environment variables in your build profile in `eas.json`
- Use EAS Secrets

## API Client

The API client (`api/client.ts`) is set up using Axios with the following features:

- Base URL configuration from environment variables
- Default headers setup
- Request interceptors for adding auth tokens
- Response interceptors for handling common response scenarios (like 401 errors)

## API Services

Each API domain has its own file with typed request and response interfaces. For example:

- `auth.ts` - Contains authentication endpoints (login, logout, etc.)

## Making API Calls

### 1. Using React Query

For data fetching, we use React Query. Here's how to use it:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTodos, createTodo } from "@/services/api/todos";

// Fetch data example
const TodoList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // Render component with data...
};

// Mutation example
const AddTodo = () => {
  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Handle success
    },
  });

  const handleSubmit = (newTodo) => {
    mutation.mutate(newTodo);
  };

  // Render form...
};
```

### 2. Direct API Calls

You can also use the API services directly:

```tsx
import { loginUser } from "@/services/api/auth";

const handleLogin = async (credentials) => {
  try {
    const response = await loginUser(credentials);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
```

## Adding New API Endpoints

To add a new API endpoint:

1. Determine which domain it belongs to (e.g., `auth`, `todos`, etc.)
2. Create a new file in the `api` directory if needed (e.g., `todos.ts`)
3. Define interfaces for request and response types
4. Create and export your API functions

Example:

```tsx
import apiClient from "./client";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get<Todo[]>("/todos");
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo> => {
  const response = await apiClient.post<Todo>("/todos", todo);
  return response.data;
};
```

## React Query Setup

The React Query provider is set up in `queryClient.tsx` and included in the app's root layout. It includes default configuration for caching, refetching, and retries.

To customize the React Query client configuration, modify the options in the `queryClient.tsx` file.
