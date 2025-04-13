import { useToast as useToastContext } from "./ToastContext";
import { ToastVariant } from "./index";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export const useToast = () => {
  const { showToast } = useToastContext();

  const toast = {
    show: (options: ToastOptions) => {
      showToast({
        title: options.title,
        description: options.description,
        variant: options.variant || "success",
      });
    },
    success: (options: Omit<ToastOptions, "variant">) => {
      showToast({
        title: options.title,
        description: options.description,
        variant: "success",
      });
    },
    error: (options: Omit<ToastOptions, "variant">) => {
      showToast({
        title: options.title,
        description: options.description,
        variant: "error",
      });
    },
  };

  return toast;
};

export default useToast;
