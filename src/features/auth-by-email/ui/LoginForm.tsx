import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { axiosInstance } from "../../../shared/api/axiosInstance";
import { useAuth } from "../../../entities/user/model/store";
import { useUI } from "../../../app/providers/UIProvider";
import { useEffect } from "react";

interface LoginFormProps {
  onSuccess: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Мінімум 6 символів має бути!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { setAuthData } = useAuth();
  const { addToast } = useUI();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthData(data.accessToken, data.role);
      addToast({
        type: "success",
        message: "Вхід успішний!",
      });
      onSuccess();
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Помилка входу. Перевірте введені дані!",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Вхід у систему
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Керування відрядженнями та погодженнями
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Email адреса
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="employee@example.com"
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 outline-none transition-all text-slate-800 dark:text-white"
        />
        {errors.email && (
          <p className="text-rose-500 text-xs font-medium mt-1 pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Пароль
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 outline-none transition-all text-slate-800 dark:text-white"
        />
        {errors.password && (
          <p className="text-rose-500 text-xs font-medium mt-1 pl-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-98 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/35 transition-all outline-none cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
      >
        {mutation.isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Вхід...
          </>
        ) : (
          "Увійти"
        )}
      </button>
    </form>
  );
}
