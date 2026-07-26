import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useCreateTrip } from "../model/useCreateTrip";
import { statusApi } from "../../../shared/api/statusApi";
import { useUI } from "../../../app/providers/UIProvider";

// Схема валідації для форми створення заявки
const tripSchema = z.object({
  purposeId: z.string().min(1, "Оберіть мету поїздки"),
  description: z.string().min(10, "Опис має містити мінімум 10 символів"),
  destination: z.string().min(3, "Вкажіть напрямок"),
  startDate: z.string().min(1, "Дата початку обов'язкова"),
  endDate: z.string().min(1, "Дата закінчення обов'язкова"),
  urgencyId: z.string().min(1, "Оберіть рівень терміновості"),
  employeePhone: z.string().min(10, "Вкажіть телефон"),
});

type TripFormValues = z.infer<typeof tripSchema>;

// Компонент форми для створення нової заявки
export default function CreateTripForm() {
  const navigate = useNavigate();
  const { addToast } = useUI();

  // Ініціалізація форми з валідацією
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
  });

  // Запит для отримання списку цілей поїздки
  const { data: purposes } = useQuery({
    queryKey: ["trip-purposes"],
    queryFn: statusApi.getPurposes,
  });

  // Запит для отримання рівнів терміновості
  const { data: urgencies } = useQuery({
    queryKey: ["urgency-levels"],
    queryFn: statusApi.getUrgencies,
  });

  // Мутація для створення нової заявки
  const createTrip = useCreateTrip();
  const onSubmit = (data: TripFormValues) => {
    createTrip.mutate(data, {
      onSuccess: (newTrip) => {
        addToast({
          type: "success",
          message: "Заявку на відрядження успішно створено!",
        });
        navigate(`/business-trips/${newTrip.id}`);
      },
      onError: () => {
        addToast({
          type: "error",
          message: "Не вдалося створити заявку. Спробуйте ще раз.",
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6"
      >
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Нова заявка на відрядження
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Заповніть усі обов'язкові поля для відправки заявки на узгодження
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Мета поїздки
            </label>
            <select
              {...register("purposeId")}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="">Оберіть...</option>
              {purposes?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.purposeId && (
              <p className="text-rose-500 text-xs font-medium pl-1">
                {errors.purposeId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Рівень терміновості
            </label>
            <select
              {...register("urgencyId")}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="">Оберіть...</option>
              {urgencies?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.urgencyId && (
              <p className="text-rose-500 text-xs font-medium pl-1">
                {errors.urgencyId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Напрямок (місто, країна)
          </label>
          <input
            type="text"
            {...register("destination")}
            placeholder="Наприклад: Київ, Україна"
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200"
          />
          {errors.destination && (
            <p className="text-rose-500 text-xs font-medium pl-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Дата початку
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200 cursor-pointer dark:[color-scheme:dark]"
            />
            {errors.startDate && (
              <p className="text-rose-500 text-xs font-medium pl-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Дата закінчення
            </label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200 cursor-pointer dark:[color-scheme:dark]"
            />
            {errors.endDate && (
              <p className="text-rose-500 text-xs font-medium pl-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Контактний телефон
          </label>
          <input
            type="text"
            placeholder="+380671112233"
            {...register("employeePhone")}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200"
          />
          {errors.employeePhone && (
            <p className="text-rose-500 text-xs font-medium pl-1">
              {errors.employeePhone.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Опис відрядження
          </label>
          <textarea
            {...register("description")}
            placeholder="Вкажіть ключові завдання, цілі зустрічі чи деталі поїздки..."
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200 min-h-[6rem]"
          />
          {errors.description && (
            <p className="text-rose-500 text-xs font-medium pl-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={createTrip.isPending}
          className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/25 active:scale-98 transition-all outline-none cursor-pointer disabled:opacity-75 disabled:pointer-events-none text-sm"
        >
          {createTrip.isPending ? (
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
              Надсилаємо...
            </>
          ) : (
            "Надіслати заявку"
          )}
        </button>
      </form>
    </div>
  );
}
