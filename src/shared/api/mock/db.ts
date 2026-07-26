// Інтерфейс для опису користувача
export interface User {
  id: string;
  email: string;
  name: string;
  role: "employee" | "manager";
}

// Інтерфейс для опису заявки на відрядження
export interface BusinessTrip {
  id: string;
  purposeId: string; // Мета поїздки (наприклад, зустріч)
  description: string; // Опис поїздки/завдання
  destination: string; // Напрямок (місто, країна)
  startDate: string; // Дата початку відрядження
  endDate: string; // Дата закінчення відрядження
  urgencyId: string; // Терміновість
  statusId: string; // Поточний статус узгодження
  createdAt: string; // Дата створення заявки
  employeeName: string; // Контактні дані: Ім'я
  employeeEmail: string; // Контактні дані: Email
  employeePhone: string; // Контактні дані: Телефон
}

// Інтерфейс для опису коментаря
export interface Comment {
  id: string;
  tripId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

// Інтерфейс для запису в історії статусів
export interface StatusHistoryEntry {
  id: string;
  tripId: string;
  oldStatusId: string | null;
  newStatusId: string;
  updatedBy: string;
  updatedAt: string;
}

// Довідник: цілі поїздки
export const tripPurposes = [
  { id: "client_meeting", name: "Зустріч з клієнтами" },
  { id: "conference", name: "Навчання та конференції" },
  { id: "partner_negotiations", name: "Переговори з партнерами" },
];

// Довідник: рівні терміновості
export const urgencyLevels = [
  { id: "standard", name: "Звичайна" },
  { id: "important", name: "Важлива" },
  { id: "critical", name: "Критична" },
];

// Довідник: статуси заявок
export const businessTripStatuses = [
  { id: "new", name: "Чернетка/Нова" },
  { id: "pending", name: "На розгляді" },
  { id: "approved", name: "Затверджено" },
  { id: "rejected", name: "Відхилено" },
];

// Початкові дані: користувачі
const initialUsers: User[] = [
  {
    id: "u-1",
    email: "employee@example.com",
    name: "Максим Співробітник",
    role: "employee",
  },
  {
    id: "u-2",
    email: "manager@example.com",
    name: "Арсеній Менеджер",
    role: "manager",
  },
  {
    id: "u-3",
    email: "dmytro@example.com",
    name: "Дмитро Інженер",
    role: "employee",
  },
  {
    id: "u-4",
    email: "svetlana@example.com",
    name: "Світлана Дизайнер",
    role: "employee",
  },
  {
    id: "u-5",
    email: "another@example.com",
    name: "Олена Тестувальник",
    role: "employee",
  },
];

// Початкові дані: заявки на відрядження
const initialBusinessTrips: BusinessTrip[] = [
  {
    id: "trip-1",
    purposeId: "client_meeting",
    description:
      "Презентація нової версії програмного продукту та узгодження ліцензійного договору.",
    destination: "Львів, Україна",
    startDate: "2026-08-01",
    endDate: "2026-08-04",
    urgencyId: "important",
    statusId: "pending",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 день тому
    employeeName: "Максим Співробітник",
    employeeEmail: "employee@example.com",
    employeePhone: "+380671112233",
  },
  {
    id: "trip-2",
    purposeId: "conference",
    description:
      "Участь у щорічній конференції розробників React Global Summit.",
    destination: "Варшава, Польща",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    urgencyId: "standard",
    statusId: "new",
    createdAt: new Date().toISOString(),
    employeeName: "Максим Співробітник",
    employeeEmail: "employee@example.com",
    employeePhone: "+380671112233",
  },
  {
    id: "trip-3",
    purposeId: "partner_negotiations",
    description:
      "Укладання дистриб'юторського договору з європейськими партнерами.",
    destination: "Берлін, Німеччина",
    startDate: "2026-07-20",
    endDate: "2026-07-25",
    urgencyId: "critical",
    statusId: "approved",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    employeeName: "Дмитро Інженер",
    employeeEmail: "dmytro@example.com",
    employeePhone: "+380507776655",
  },
  {
    id: "trip-4",
    purposeId: "client_meeting",
    description:
      "Аварійне налагодження обладнання на серверному майданчику клієнта.",
    destination: "Київ, Україна",
    startDate: "2026-07-15",
    endDate: "2026-07-17",
    urgencyId: "critical",
    statusId: "rejected",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    employeeName: "Максим Співробітник",
    employeeEmail: "employee@example.com",
    employeePhone: "+380671112233",
  },
  {
    id: "trip-5",
    purposeId: "conference",
    description:
      "Внутрішній тренінг для тімлідів компанії з управління ризиками.",
    destination: "Одеса, Україна",
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    urgencyId: "standard",
    statusId: "new",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    employeeName: "Світлана Дизайнер",
    employeeEmail: "svetlana@example.com",
    employeePhone: "+380632223344",
  },
];

// Початкові дані: коментарі
const initialComments: Comment[] = [
  {
    id: "com-1",
    tripId: "trip-1",
    authorName: "Арсеній Менеджер",
    text: "Потрібно надати детальний кошторис витрат на проживання та квитки перед фінальним погодженням.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "com-2",
    tripId: "trip-4",
    authorName: "Арсеній Менеджер",
    text: "Узгодження відхилено. Замість відрядження проблему буде вирішено віддалено через VPN.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Початкові дані: історія статусів
const initialStatusHistory: StatusHistoryEntry[] = [
  {
    id: "h-1",
    tripId: "trip-1",
    oldStatusId: "new",
    newStatusId: "pending",
    updatedBy: "Максим Співробітник",
    updatedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
  },
  {
    id: "h-2",
    tripId: "trip-3",
    oldStatusId: "pending",
    newStatusId: "approved",
    updatedBy: "Арсеній Менеджер",
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// --- Persistence Layer ---

// Отримує дані з localStorage або використовує початкові дані, якщо в сховищі нічого немає.
function getFromStorage<T>(key: string, initialData: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Помилка читання '${key}' з localStorage`, error);
  }
  // Якщо в сховищі нічого немає, ініціалізуємо його початковими даними
  window.localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

// Оновлює дані в localStorage.
function updateStorage<T>(key: string, data: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Помилка запису '${key}' в localStorage`, error);
  }
}

// --- Ініціалізація стану "БД" з localStorage ---

export let users: User[] = getFromStorage("db_users", initialUsers);
export let businessTrips: BusinessTrip[] = getFromStorage(
  "db_businessTrips",
  initialBusinessTrips,
);
export let comments: Comment[] = getFromStorage("db_comments", initialComments);
export let statusHistory: StatusHistoryEntry[] = getFromStorage(
  "db_statusHistory",
  initialStatusHistory,
);

// --- Функції для оновлення "БД" ---

export const db = {
  update: (
    key: "businessTrips" | "comments" | "statusHistory" | "users",
    data: any,
  ) => {
    updateStorage(`db_${key}`, data);
  },
};
