import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "employee" | "manager" | null;

interface AuthContextType {
  accessToken: string | null;
  role: UserRole;
  setAuthData: (token: string, role: UserRole) => void;
  clearAuthData: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Функція для безпечної перевірки ролі при завантаженні
const getInitialRole = (): UserRole => {
  const savedRole = localStorage.getItem("userRole");
  if (savedRole === "employee" || savedRole === "manager") {
    return savedRole;
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [role, setRole] = useState<UserRole>(getInitialRole());

  const setAuthData = (token: string, role: UserRole) => {
    setAccessToken(token);
    setRole(role);
    localStorage.setItem("accessToken", token);
    if (role) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  const clearAuthData = () => {
    setAccessToken(null);
    setRole(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, role, setAuthData, clearAuthData, logout: clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
