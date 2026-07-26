import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../entities/user/model/store";
import { tripApi } from "../../shared/api/tripApi";
import { statusApi } from "../../shared/api/statusApi";
import TripCard from "../../entities/trip/ui/TripCard";
import { useUI } from "../../app/providers/UIProvider";
import { useEffect } from "react";

export default function BusinessTripsPage() {
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useUI();
  const statusFilter = searchParams.get("status") || "";

  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trips", role],
    queryFn: () =>
      role === "employee" ? tripApi.getMyTrips() : tripApi.getAllTrips(),
  });

  useEffect(() => {
    if (isError && error) {
      addToast({
        type: "error",
        message: "Упс! Не вдалося завантажити заявки на відрядження.",
      });
    }
  }, [isError, error, addToast]);

  const { data: statuses } = useQuery({
    queryKey: ["trip-statuses"],
    queryFn: statusApi.getStatuses,
  });

  const { data: purposes } = useQuery({
    queryKey: ["trip-purposes"],
    queryFn: statusApi.getPurposes,
  });
  const { data: urgencies } = useQuery({
    queryKey: ["urgency-levels"],
    queryFn: statusApi.getUrgencies,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Завантаження заявок...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Помилка завантаження</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Невдалося підключитися до сервера. Спробуйте оновити сторінку.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          Оновити
        </button>
      </div>
    );
  }

  const filteredTrips = statusFilter
    ? trips?.filter((trip) => trip.statusId === statusFilter) || []
    : trips || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Заявки на відрядження
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Переглядайте, створюйте та відстежуйте процеси узгоджень
          </p>
        </div>

        {role === "employee" && (
          <button
            onClick={() => {
              navigate("/business-trips/new");
              addToast({
                type: "info",
                message: "Переходимо до створення заявки",
              });
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-purple-500/15 hover:shadow-lg hover:shadow-purple-500/30 active:scale-98 transition-all cursor-pointer text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Створити заявку
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Фільтр за статусом:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (value) setSearchParams({ status: value });
            else setSearchParams({});
          }}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="">Всі</option>
          {statuses?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Заявок не знайдено</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            {statusFilter
              ? "У системі немає заявок із цим статусом на даний момент."
              : "Поки що немає створених заявок у вашому профілі."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              purposes={purposes || []}
              urgencies={urgencies || []}
              statuses={statuses || []}
              onClick={() => navigate(`/business-trips/${trip.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
