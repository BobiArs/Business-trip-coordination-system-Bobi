import axios from "axios";

// Створюємо екземпляр Axios для всіх запитів
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Інтерсептор для додавання токена до кожного запиту
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Інтерсептор для обробки помилки 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Перевіряємо, чи помилка саме 401
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
