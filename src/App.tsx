import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./entities/user/model/store";
import { UIProvider } from "./app/providers/UIProvider";
import ToastContainer from "./widgets/ToastContainer";
import AppRouter from "./app/router";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
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
