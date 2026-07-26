// Тип користувача
export interface User {
  id: string;
  email: string;
  name: string;
  role: "employee" | "manager";
}

// Тип заявки на відрядження
export interface BusinessTrip {
  id: string;
  purposeId: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  urgencyId: string;
  statusId: string;
  createdAt: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone: string;
}

// Тип коментаря менеджера
export interface Comment {
  id: string;
  tripId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

// Тип історії зміни статусів
export interface StatusHistoryEntry {
  id: string;
  tripId: string;
  oldStatusId: string | null;
  newStatusId: string;
  updatedBy: string;
  updatedAt: string;
}

// Довідкові сутності
export interface TripPurpose {
  id: string;
  name: string;
}

export interface UrgencyLevel {
  id: string;
  name: string;
}

export interface BusinessTripStatus {
  id: string;
  name: string;
}
