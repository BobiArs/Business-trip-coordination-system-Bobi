// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handlers } from "../../shared/api/mock/handlers";
import { AuthProvider } from "../../entities/user/model/store";
import { UIProvider } from "../../app/providers/UIProvider";
import LoginPage from "../../pages/login/LoginPage";

// Ініціалізуємо MSW-сервер з тими самими handlers, що і в додатку
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear(); // Очищаємо localStorage між тестами для ізоляції
});
afterAll(() => server.close());

// Хелпер для рендеру сторінки з усіма обов'язковими провайдерами
const renderLoginPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
};

// ТЕСТ 1: Успішний вхід під роллю співробітника
describe("Тест 1: Успішний вхід співробітника", () => {
  it("при правильних даних повинен успішно залогінитись та зберегти токен", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/employee@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole("button", { name: /увійти/i });

    // Перевіряємо форма відображається
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Вводимо коректні тестові дані
    await user.type(emailInput, "employee@example.com");
    await user.type(passwordInput, "employee123");
    await user.click(submitButton);

    // Після успіху у localStorage мають з'явитися дані сесії
    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toBe("token-employee-1");
    });
    expect(localStorage.getItem("userRole")).toBe("employee");
  });
});

// ТЕСТ 2: Помилка сервера (400 та Zod валідація)
describe("Тест 2: Відображення помилки при неправильних даних / 500 Server Error", () => {
  it("при невірних облікових даних не зберігає токен і форма залишається", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/employee@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole("button", { name: /увійти/i });

    // Вводимо НЕВІРНІ дані (MSW поверне 400)
    await user.type(emailInput, "wrong@test.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    // Чекаємо завершення запиту
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Після отримання 400 — токен не повинен бути збережений
    expect(localStorage.getItem("accessToken")).toBeNull();

    // Форма все ще відображається — перенаправлення не відбулося
    expect(screen.getByRole("button", { name: /увійти/i })).toBeInTheDocument();
  });

  it("показує повідомлення про помилку валідації Zod якщо пароль занадто короткий", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/employee@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole("button", { name: /увійти/i });

    // Коректний email, але пароль занадто короткий (менше 6 символів)
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "123"); // Тільки 3 символи — Zod вимагає мінімум 6
    await user.click(submitButton);

    // RHF/Zod повідомлення про помилку пароля повинне з'явитись у DOM
    await waitFor(() => {
      expect(screen.getByText(/мінімум 6 символів/i)).toBeInTheDocument();
    });
  });
});
