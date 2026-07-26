// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handlers } from "../../shared/api/mock/handlers";
import { AuthProvider } from "../../entities/user/model/store";
import { UIProvider } from "../../app/providers/UIProvider";
import BusinessTripsPage from "../../pages/business-trips/BusinessTripsPage";

// MSW-сервер з handlers із додатку
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Хелпер: рендер сторінки зі списком заявок від імені менеджера
const renderTripsPageAsManager = () => {
  // Емулюємо залогінений стан менеджера через localStorage
  localStorage.setItem("accessToken", "token-manager-2");
  localStorage.setItem("userRole", "manager");

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <MemoryRouter initialEntries={["/business-trips"]}>
            <Routes>
              <Route path="/business-trips" element={<BusinessTripsPage />} />
            </Routes>
          </MemoryRouter>
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
};

// ТЕСТ 2: Відображення помилки при збої сервера (500 / Network Error)
describe("Тест 2: Реакція інтерфейсу на серверні помилки (500 і Network Error)", () => {
  it("відображає блок помилки коли сервер повертає 500 Internal Server Error", async () => {
    // Перевизначаємо handler для списку заявок — симулюємо 500
    server.use(
      http.get("/business-trips", () => {
        return HttpResponse.json(
          { message: "Внутрішня помилка сервера" },
          { status: 500 },
        );
      }),
    );

    renderTripsPageAsManager();

    // Спочатку має бути спінер
    await waitFor(() => {
      expect(screen.queryByText(/завантаження/i)).toBeTruthy();
    });

    // Потім — блок помилки
    await waitFor(
      () => {
        expect(screen.getByText(/помилка завантаження/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Кнопка "Оновити" для retry
    expect(
      screen.getByRole("button", { name: /оновити/i }),
    ).toBeInTheDocument();
  });

  it("відображає блок помилки при Network Error (відсутній зв'язок)", async () => {
    // Перевизначаємо handler — симулюємо network error
    server.use(
      http.get("/business-trips", () => {
        return HttpResponse.error();
      }),
    );

    renderTripsPageAsManager();

    // Чекаємо появу блоку помилки
    await waitFor(
      () => {
        expect(screen.getByText(/помилка завантаження/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
