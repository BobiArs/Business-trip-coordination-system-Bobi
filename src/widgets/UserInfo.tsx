import { useAuth } from "../entities/user/model/store";

export default function UserInfo() {
  const { role } = useAuth();
  const userName = localStorage.getItem("userName");

  return (
    <div className="text-sm">
      <p>{userName || "Користувач"}</p>
      <p className="italic">Роль: {role}</p>
    </div>
  );
}
