import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../entities/user/model/store";
import UserInfo from "./UserInfo";

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-purple-700 text-white p-4 flex justify-between items-center">
      <nav className="flex gap-4">
        <NavLink
          to="/business-trips"
          className={({ isActive }) =>
            isActive ? "font-bold underline" : "hover:underline"
          }
        >
          Заявки
        </NavLink>

        {role === "employee" && (
          <NavLink
            to="/business-trips/new"
            className={({ isActive }) =>
              isActive ? "font-bold underline" : "hover:underline"
            }
          >
            Нова заявка
          </NavLink>
        )}
      </nav>

      <div className="flex gap-4 items-center">
        <UserInfo />
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Вийти
        </button>
      </div>
    </header>
  );
}
