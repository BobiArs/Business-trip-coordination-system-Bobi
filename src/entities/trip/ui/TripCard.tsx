import type {
  BusinessTrip,
  BusinessTripStatus,
  TripPurpose,
  UrgencyLevel,
} from "../model/types";

interface TripCardProps {
  trip: BusinessTrip;
  purposes: TripPurpose[];
  urgencies: UrgencyLevel[];
  statuses: BusinessTripStatus[];
  onClick?: () => void;
}

export default function TripCard({
  trip,
  purposes,
  urgencies,
  statuses,
  onClick,
}: TripCardProps) {
  // Отримуємо назви за ID для довідників
  const purposeName =
    purposes.find((p) => p.id === trip.purposeId)?.name || "-";
  const urgencyName =
    urgencies.find((u) => u.id === trip.urgencyId)?.name || "-";
  const statusName = statuses.find((s) => s.id === trip.statusId)?.name || "-";

  // Повертає CSS-клас для бейджа статусу
  const getStatusBadgeClass = (statusId: string) => {
    switch (statusId) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
      default:
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50";
    }
  };

  // Повертає JSX-елемент індикатора терміновості
  const getUrgencyIndicator = (urgencyId: string) => {
    switch (urgencyId) {
      case "critical":
        return (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        );
      case "important":
        return <span className="h-2 w-2 rounded-full bg-amber-500"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-slate-400"></span>;
    }
  };

  // Повертає CSS-клас для тексту терміновості
  const getUrgencyTextClass = (urgencyId: string) => {
    switch (urgencyId) {
      case "critical":
        return "text-rose-600 dark:text-rose-400 font-semibold";
      case "important":
        return "text-amber-600 dark:text-amber-400 font-semibold";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  // Обрізає текст до вказаної довжини
  const truncateText = (text: string, length = 100) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/35 px-2.5 py-1 rounded-lg">
            {purposeName}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(trip.statusId)}`}
          >
            {statusName}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {trip.destination}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[3rem]">
            {truncateText(trip.description)}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500">
              Дати поїздки:
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {trip.startDate} — {trip.endDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500">
              Терміновість:
            </span>
            <div className="flex items-center gap-1.5">
              {getUrgencyIndicator(trip.urgencyId)}
              <span className={getUrgencyTextClass(trip.urgencyId)}>
                {urgencyName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Співробітник: {trip.employeeName}</span>
        <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
