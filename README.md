# Система узгодження відряджень

Це клієнтський веб-додаток (SPA), створений для автоматизації процесу подання та узгодження заявок на відрядження. Проект розроблено на **React** та **TypeScript** і демонструє роботу з формами, станом, маршрутизацією та імітацією серверної частини.

---

## 🖼️ Скріншоти

|               Сторінка входу               |               Список заявок (Менеджер)                |                    Картка заявки                     |
| :----------------------------------------: | :---------------------------------------------------: | :--------------------------------------------------: |
| ![Сторінка входу](./assets/login-page.png) | ![Список заявок менеджера](./assets/manager-dash.png) | ![Детальна картка заявки](./assets/trip-details.png) |

---

## ✨ Основні можливості

### Для Співробітника:

- **Вхід у систему** під своєю роллю.
- **Створення нової заявки** на відрядження через зручну форму.
- **Перегляд списку** лише своїх поданих заявок.
- **Відстеження статусу** узгодження кожної заявки.

### Для Менеджера:

- **Перегляд загального списку** всіх заявок у компанії.
- **Фільтрація заявок** за статусом (наприклад, "На розгляді", "Затверджено").
- **Перегляд детальної картки** будь-якої заявки.
- **Зміна статусу** заявки (затвердження або відхилення).
- **Додавання коментарів** до заявок для уточнення деталей.

---

## Запуск проекту локально

Щоб запустити проект на вашому комп'ютері, виконайте наступні кроки:

```bash
# 1. Встановити залежності
# (переконайтесь, що у вас встановлено Node.js)
npm install

# 2. Запустити dev-сервер (з MSW)
# Додаток запуститься в режимі розробки
npm run dev
```

Додаток буде доступний на [http://localhost:5173](http://localhost:5173).

### Тестові облікові записи

| Роль         | Email                  | Пароль        |
| ------------ | ---------------------- | ------------- |
| Співробітник | `employee@example.com` | `employee123` |
| Менеджер     | `manager@example.com`  | `manager123`  |

---

## 🧪 Запуск тестів

```bash
# Запустити інтеграційні тести (Vitest + RTL)
npm run test

# Запустити тести в режимі спостереження
npm run test:watch
```

---

## 📂 Структура проекту (Feature-Sliced Design Lite)

```
src/
├── app/                    # Ініціалізація (провайдери, маршрутизатор, layouts)
│   ├── layouts/            # AppLayout (з навбаром) та PublicLayout (для /login)
│   ├── providers/          # UIProvider (Context API для Toast-повідомлень)
│   └── router.tsx          # BrowserRouter + Protected Routes
│
├── pages/                  # Сторінки-композитори
│   ├── login/              # Сторінка авторизації (/login)
│   ├── business-trips/     # Список заявок та форма створення (/business-trips, /business-trips/new)
│   ├── trip/               # Детальна картка заявки (/business-trips/:id)
│   └── not-found/          # Сторінка 404
│
├── widgets/                # Великі автономні блоки
│   └── ToastContainer.tsx  # Глобальний рендер Toast-повідомлень
│
├── features/               # Бізнес-дії користувача
│   ├── auth-by-email/      # Форма входу (RHF + Zod)
│   ├── auth-me/            # Запит профілю GET /auth/me
│   ├── create-trip/        # Форма та хук useCreateTrip (POST + invalidateQueries)
│   ├── approve-trip/       # Кнопка зміни статусу (PATCH + invalidateQueries)
│   └── add-manager-comment/# Форма коментаря (POST + invalidateQueries)
│
├── entities/               # Бізнес-сутності
│   ├── trip/
│   │   ├── model/types.ts  # TypeScript-типи (BusinessTrip, Comment, StatusHistoryEntry…)
│   │   └── ui/             # TripCard, TripDetails
│   └── user/
│       └── model/store.tsx # AuthProvider (Context API, localStorage)
│
├── shared/                 # Перевикористовувані ресурси
│   └── api/
│       ├── axiosInstance.ts # Axios instance + request/response interceptors (401 → logout)
│       ├── tripApi.ts       # API-функції для заявок
│       ├── statusApi.ts     # API-функції для довідників
│       └── mock/
│           ├── db.ts        # In-memory база даних (seed-дані за варіантом 2)
│           ├── handlers.ts  # MSW handlers для всіх ендпоінтів
│           ├── browser.ts   # MSW setupWorker (для браузера)
│           └── server.ts    # MSW setupServer (для тестів)
│
└── test/                   # Тести
    ├── setup.ts             # Глобальна ініціалізація (@testing-library/jest-dom)
    └── integration/
        ├── LoginForm.test.tsx    # Тест 1: успішний вхід + Zod валідація
        └── ServerErrors.test.tsx # Тест 2: реакція на 500 та Network Error
```

---

## 🏛️ Архітектурні рішення

### Mock API (MSW v2)

- Всі HTTP-запити перехоплюються **MSW (Mock Service Worker)** у браузері через `setupWorker`.
- В тестах використовуються ті самі `handlers` через `msw/node → setupServer`, що гарантує консистентність.
- База даних в пам'яті (`db.ts`) містить seed-дані з 5 заявками, 2 коментарями, 2 записами в історії, 2 користувачами — як вимагає `mock-db.md`.
- Штучна затримка `delay(800ms)` на ендпоінтах списків для демонстрації loading-стану.

### Система повідомлень (Toast, Context API)

- **`UIProvider`** — React Context із масивом `toasts[]` та функціями `addToast / removeToast`.
- **`ToastContainer`** — рендерить активні повідомлення в правому нижньому куті.
- Тости автоматично зникають через 3 секунди (`setTimeout`), або їх можна закрити кліком.
- Використовується при: вході, помилці входу, створенні заявки, зміні статусу, помилках API.

### Авторизація (Axios Interceptors)

- **Request interceptor**: додає `Authorization: Bearer <token>` з `localStorage` до кожного запиту.
- **Response interceptor**: при отриманні `401` — очищує `localStorage` і перенаправляє на `/login`.

### Server State (TanStack Query v5)

- `useQuery` — для читання даних (список, картка, коментарі, історія, довідники).
- `useMutation` — для POST/PATCH-запитів.
- `invalidateQueries` після кожної мутації для автоматичного оновлення кешу.
- Обробка станів: `isLoading`, `isError`, Empty State через окремі гілки UI.

### Оптимізація (Lazy Loading)

- `BusinessTripDetailsPage` та `CreateBusinessTripPage` завантажуються через `React.lazy()` + `<Suspense>`.
- При переході показується спінер-заглушка (`PageLoader`).

---

## 🗣️ Реалізовані користувацькі сценарії

1. **Вхід за роллю** — форма з RHF + Zod-валідацією, `useRef`-автофокус на поле Email.
2. **Список своїх заявок (employee)** — GET `/business-trips/my`, завантаження зі spinner, empty state.
3. **Список усіх заявок (manager)** — GET `/business-trips`, фільтр за статусом через Search Params в URL.
4. **Створення заявки** — форма з усіма полями, POST → редірект на `/business-trips/:id`.
5. **Перегляд деталей** — двоколонковий dashboard (дані + timeline + коментарі).
6. **Зміна статусу (manager)** — PATCH `/business-trips/:id/status` → оновлення кешу.
7. **Додавання коментаря (manager)** — POST `/business-trips/:id/comments` → оновлення картки.
8. **Розлогування при 401** — автоматичне очищення сесії через Axios interceptor.
