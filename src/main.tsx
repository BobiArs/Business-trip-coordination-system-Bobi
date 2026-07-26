import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Функція для запуску Mock Service Worker
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./shared/api/mock/browser");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

// Запускаємо мокінг, а потім рендеримо додаток
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
