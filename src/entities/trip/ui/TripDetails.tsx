import type {
  BusinessTrip,
  BusinessTripStatus,
  Comment,
  StatusHistoryEntry,
  TripPurpose,
  UrgencyLevel,
} from "../model/types";

interface TripDetailsProps {
  trip: BusinessTrip;
  comments: Comment[];
  history: StatusHistoryEntry[];
  purposes: TripPurpose[];
  urgencies: UrgencyLevel[];
  statuses: BusinessTripStatus[];
}

export default function TripDetails({
  trip,
  comments,
  history,
  purposes,
  urgencies,
  statuses,
}: TripDetailsProps) {
  const purposeName =
    purposes.find((p) => p.id === trip.purposeId)?.name || "-";
  const urgencyName =
    urgencies.find((u) => u.id === trip.urgencyId)?.name || "-";
  const statusName = statuses.find((s) => s.id === trip.statusId)?.name || "-";

  // Helpers for styling
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

  const getUrgencyTextClass = (urgencyId: string) => {
    switch (urgencyId) {
      case "critical":
        return "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50";
      case "important":
        return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50";
      default:
        return "text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: core info & comments */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/35 px-2.5 py-1 rounded-lg">
                {purposeName}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight pt-1">
                {trip.destination}
              </h2>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusBadgeClass(trip.statusId)}`}>
              {statusName}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Опис відрядження
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 p-4 rounded-xl">
              {trip.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Дати поїздки</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{trip.startDate} — {trip.endDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-xl">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Терміновість</span>
                  <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border mt-0.5 ${getUrgencyTextClass(trip.urgencyId)}`}>
                    {urgencyName}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-500 rounded-xl">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Контактні дані</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">{trip.employeeName}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">{trip.employeeEmail} · {trip.employeePhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 text-slate-400 rounded-xl">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Створено</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{new Date(trip.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Коментарі */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Коментарі менеджера</h3>
          
          {comments.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20">
              <p className="text-sm text-slate-400 dark:text-slate-500">До цієї заявки немає коментарів</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 items-start bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {c.authorName[0]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Timeline History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm self-start space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Хід узгодження</h3>
        
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">Немає записів історії</p>
        ) : (
          <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 dark:border-slate-800/80 ml-3 py-1">
            {history.map((h) => {
              const oldStatusName = statuses.find((s) => s.id === h.oldStatusId)?.name || h.oldStatusId || "—";
              const newStatusName = statuses.find((s) => s.id === h.newStatusId)?.name || h.newStatusId;
              
              return (
                <div key={h.id} className="relative group">
                  {/* Bullet node */}
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-950 border-purple-500 dark:border-purple-400 group-hover:scale-110 transition-transform">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                  </span>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Змінено з <strong className="text-slate-700 dark:text-slate-300">{oldStatusName}</strong> на{" "}
                      <strong className="text-purple-600 dark:text-purple-400">{newStatusName}</strong>
                    </p>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      <span>Оновив: <strong className="font-semibold">{h.updatedBy}</strong></span>
                      <span className="block mt-0.5">{new Date(h.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
