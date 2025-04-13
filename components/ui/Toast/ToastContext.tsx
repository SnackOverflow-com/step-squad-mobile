import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { nanoid } from "nanoid/non-secure";

import Toast, { ToastVariant } from "./index";

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextProps {
  showToast: (options: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const ToastContainer = styled(View)`
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
  gap: 1px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
`;

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((options: Omit<ToastItem, "id">) => {
    const id = nanoid();
    setToasts((prevToasts) => [...prevToasts, { id, ...options }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onDismiss={dismissToast}
            isStacked={index > 0}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
