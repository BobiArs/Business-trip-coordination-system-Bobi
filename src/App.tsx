import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./entities/user/model/store";
import { UIProvider } from "./app/providers/UIProvider";
import ToastContainer from "./widgets/ToastContainer";
import AppRouter from "./app/router";
import "./index.css";
import { useEffect } from "react";

// Створюємо та налаштовуємо клієнт TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Головний компонент додатку з усіма провайдерами
export default function App() {
  useEffect(() => {
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.type = "image/png";
    link.href = "/favicon.png";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <AppRouter />
          <ToastContainer />
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
