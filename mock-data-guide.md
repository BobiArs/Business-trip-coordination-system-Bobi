# Посібник з інтеграції MSW та опису Handlers (Варіант 2)

Ця інструкція містить перехоплювачі запитів (handlers) для MSW для роботи з системою погодження відряджень.

---

## 🛠️ Крок 1. Створення Handlers (`src/shared/api/mock/handlers.ts`)

Цей код перехоплює HTTP-запити до ендпоінтів `/business-trips`. Він включає авторизацію, симуляцію 500 помилки, помилки мережі, фільтрацію за статусом та запис історії.

```typescript
import { http, HttpResponse, delay } from "msw";
import {
  users,
  businessTrips,
  comments,
  statusHistory,
  tripPurposes,
  urgencyLevels,
  businessTripStatuses,
  User,
  BusinessTrip,
} from "./db"; // Шлях до файлу mock-db

const API_URL = "http://localhost:3000";

// Хелпер для валідації токенів
const getAuthenticatedUser = (request: Request): User | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");

  if (token === "token-employee-1") return users[0];
  if (token === "token-manager-2") return users[1];
  return null;
};

// Хелпер для перевірки примусових помилок (500 або network error)
const checkForForcedErrors = (request: Request) => {
  const forceError = request.headers.get("x-force-error");
  if (forceError === "500") {
    return HttpResponse.json(
      { message: "Внутрішня помилка сервера" },
      { status: 500 },
    );
  }
  if (forceError === "network") {
    return HttpResponse.error();
  }
  return null;
};

export const handlers = [
  // 1. POST /auth/login — Вхід
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const { email, password } = (await request.json()) as any;

    if (email === "employee@example.com" && password === "employee123") {
      return HttpResponse.json({
        accessToken: "token-employee-1",
        role: "employee",
      });
    }

    if (email === "manager@example.com" && password === "manager123") {
      return HttpResponse.json({
        accessToken: "token-manager-2",
        role: "manager",
      });
    }

    return HttpResponse.json(
      { message: "Невірний email або пароль" },
      { status: 400 },
    );
  }),

  // 2. GET /auth/me — Профіль
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    return HttpResponse.json(user);
  }),

  // 3. GET /business-trips/my — Список власних заявок співробітника
  http.get(`${API_URL}/business-trips/my`, async ({ request }) => {
    await delay(800); // Штучна затримка

    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "employee") {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const myTrips = businessTrips.filter((t) => t.employeeEmail === user.email);
    return HttpResponse.json(myTrips);
  }),

  // 4. GET /business-trips — Загальний список для менеджера
  http.get(`${API_URL}/business-trips`, async ({ request }) => {
    await delay(800);

    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "manager") {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Підтримка фільтрації за статусом
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    let filteredTrips = businessTrips;
    if (statusFilter && statusFilter !== "all") {
      filteredTrips = businessTrips.filter((t) => t.statusId === statusFilter);
    }

    return HttpResponse.json(filteredTrips);
  }),

  // 5. GET /business-trips/:id — Картка відрядження
  http.get(`${API_URL}/business-trips/:id`, ({ request, params }) => {
    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tripId = params.id as string;
    const item = businessTrips.find((t) => t.id === tripId);
    if (!item)
      return HttpResponse.json(
        { message: "Заявку не знайдено" },
        { status: 404 },
      );

    if (user.role === "employee" && item.employeeEmail !== user.email) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const tripComments = comments.filter((c) => c.tripId === tripId);

    return HttpResponse.json({
      ...item,
      comments: tripComments,
    });
  }),

  // 6. POST /business-trips — Створення заявки
  http.post(`${API_URL}/business-trips`, async ({ request }) => {
    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "employee")
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = (await request.json()) as any;

    const newTrip: BusinessTrip = {
      id: `trip-${Math.random().toString(36).substr(2, 9)}`,
      purposeId: body.purposeId,
      description: body.description,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      urgencyId: body.urgencyId,
      statusId: "new", // Створюється зі статусом "Чернетка/Нова"
      createdAt: new Date().toISOString(),
      employeeName: user.name,
      employeeEmail: user.email,
      employeePhone: body.employeePhone || "+380000000000",
    };

    businessTrips.unshift(newTrip);

    // Перший запис в історію
    statusHistory.push({
      id: `h-${Math.random().toString(36).substr(2, 9)}`,
      tripId: newTrip.id,
      oldStatusId: null,
      newStatusId: "new",
      updatedBy: user.name,
      updatedAt: newTrip.createdAt,
    });

    return HttpResponse.json(newTrip, { status: 201 });
  }),

  // 7. PATCH /business-trips/:id/status — Зміна статусу менеджером
  http.patch(
    `${API_URL}/business-trips/:id/status`,
    async ({ request, params }) => {
      const errorResponse = checkForForcedErrors(request);
      if (errorResponse) return errorResponse;

      const user = getAuthenticatedUser(request);
      if (!user)
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      if (user.role !== "manager")
        return HttpResponse.json({ message: "Forbidden" }, { status: 403 });

      const tripId = params.id as string;
      const item = businessTrips.find((t) => t.id === tripId);
      if (!item)
        return HttpResponse.json(
          { message: "Заявку не знайдено" },
          { status: 404 },
        );

      const { statusId } = (await request.json()) as any;

      // Запис в історію статусів
      statusHistory.push({
        id: `h-${Math.random().toString(36).substr(2, 9)}`,
        tripId,
        oldStatusId: item.statusId,
        newStatusId: statusId,
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
      });

      item.statusId = statusId;

      return HttpResponse.json(item);
    },
  ),

  // 8. POST /business-trips/:id/comments — Додавання коментаря
  http.post(
    `${API_URL}/business-trips/:id/comments`,
    async ({ request, params }) => {
      const errorResponse = checkForForcedErrors(request);
      if (errorResponse) return errorResponse;

      const user = getAuthenticatedUser(request);
      if (!user)
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      if (user.role !== "manager")
        return HttpResponse.json({ message: "Forbidden" }, { status: 403 });

      const tripId = params.id as string;
      const { text } = (await request.json()) as any;

      const newComment = {
        id: `com-${Math.random().toString(36).substr(2, 9)}`,
        tripId,
        authorName: user.name,
        text,
        createdAt: new Date().toISOString(),
      };

      comments.push(newComment);

      return HttpResponse.json(newComment, { status: 201 });
    },
  ),

  // 9. GET /business-trips/:id/history — Отримання історії статусів
  http.get(`${API_URL}/business-trips/:id/history`, ({ request, params }) => {
    const errorResponse = checkForForcedErrors(request);
    if (errorResponse) return errorResponse;

    const user = getAuthenticatedUser(request);
    if (!user)
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tripId = params.id as string;
    const tripHistory = statusHistory.filter((h) => h.tripId === tripId);

    return HttpResponse.json(tripHistory);
  }),

  // 10. GET /trip-purposes — Цілі поїздки
  http.get(`${API_URL}/trip-purposes`, () => HttpResponse.json(tripPurposes)),

  // 11. GET /urgency-levels — Рівні терміновості
  http.get(`${API_URL}/urgency-levels`, () => HttpResponse.json(urgencyLevels)),

  // 12. GET /business-trip-statuses — Статуси заявок
  http.get(`${API_URL}/business-trip-statuses`, () =>
    HttpResponse.json(businessTripStatuses),
  ),
];
```

---

## 🚀 Крок 2. Ініціалізація та запуск у додатку

Налаштування файлів `browser.ts`, `server.ts` та підключення у `main.tsx` є абсолютно ідентичним до першого варіанту (див. відповідну інструкцію у папці `task-01/mock-data-guide.md`).
