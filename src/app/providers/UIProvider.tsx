import { createContext, useContext, useState, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface UIContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </UIContext.Provider>
  );
};

// хук useUI - для доступу до addToast та toasts
export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI необхідно використовувати протягом UIProvider");
  }

  return ctx;
};
