import { useNavigate } from "react-router-dom";
import LoginForm from "../../features/auth-by-email/ui/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <LoginForm onSuccess={() => navigate("/business-trips")} />
    </div>
  );
}
