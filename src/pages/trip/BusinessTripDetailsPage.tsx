import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../../entities/user/model/store";
import { tripApi } from "../../shared/api/tripApi";
import { statusApi } from "../../shared/api/statusApi";
import TripDetails from "../../entities/trip/ui/TripDetails";
import ApproveTripButton from "../../features/approve-trip/ui/ApproveTripButton";
import AddCommentForm from "../../features/add-manager-comment/ui/AddCommentForm";
import { useUI } from "../../app/providers/UIProvider";
import { useEffect } from "react";

export default function BusinessTripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const { addToast } = useUI();

  const {
    data: trip,
    isLoading: tripLoading,
    isError: tripError,
    error: tripQueryError,
  } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripApi.getTripById(id!),
  });

  const {
    data: comments,
    isError: commentsError,
    error: commentsQueryError,
  } = useQuery({
    queryKey: ["trip-comments", id],
    queryFn: () => tripApi.getTripComments(id!),
  });

  const {
    data: history,
    isError: historyError,
    error: historyQueryError,
  } = useQuery({
    queryKey: ["trip-history", id],
    queryFn: () => tripApi.getTripHistory(id!),
  });

  useEffect(() => {
    if (tripError && tripQueryError) {
      addToast({
        type: "error",
        message: "Чогось не вдалося завантажити вашу заявку, спробуйте пізніше!",
      });
    }
  }, [tripError, tripQueryError, addToast]);

  useEffect(() => {
    if (commentsError && commentsQueryError) {
      addToast({
        type: "error",
        message: "Чогось не вдалося завантажити коментарі, спробуйте пізніше!",
      });
    }
  }, [commentsError, commentsQueryError, addToast]);

  useEffect(() => {
    if (historyError && historyQueryError) {
      addToast({
        type: "error",
        message: "Чогось не вдалося завантажити історію статусів, спробуйте пізніше!",
      });
    }
  }, [historyError, historyQueryError, addToast]);

  const { data: purposes } = useQuery({
    queryKey: ["trip-purposes"],
    queryFn: statusApi.getPurposes,
  });

  const { data: urgencies } = useQuery({
    queryKey: ["urgency-levels"],
    queryFn: statusApi.getUrgencies,
  });

  const { data: statuses } = useQuery({
    queryKey: ["trip-statuses"],
    queryFn: statusApi.getStatuses,
  });

  if (tripLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Завантаження заявки...</p>
      </div>
    );
  }

  if (tripError) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Помилка завантаження</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Невдалося знайти заявку або виникла помилка на сервері.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          Оновити
        </button>
      </div>
    );
  }

  if (!trip) return <p className="text-center py-10">Заявку не знайдено</p>;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <TripDetails
        trip={trip}
        comments={comments || []}
        history={history || []}
        purposes={purposes || []}
        urgencies={urgencies || []}
        statuses={statuses || []}
      />

      {role === "manager" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Дії менеджера</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Ви можете погодити, відхилити або залишити коментар до заявки</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <ApproveTripButton
              tripId={trip.id}
              newStatusId="approved"
              label="Затвердити"
              onSuccess={() =>
                addToast({ type: "success", message: "Заявку затверджено успішно" })
              }
              onError={() =>
                addToast({
                  type: "error",
                  message: "Не вдалося затвердити заявку",
                })
              }
            />
            <ApproveTripButton
              tripId={trip.id}
              newStatusId="rejected"
              label="Відхилити"
              onSuccess={() =>
                addToast({ type: "success", message: "Заявку відхилено" })
              }
              onError={() =>
                addToast({
                  type: "error",
                  message: "Не вдалося відхилити заявку",
                })
              }
            />
          </div>
          <AddCommentForm
            tripId={trip.id}
            onSuccess={() =>
              addToast({ type: "success", message: "Коментар додано" })
            }
            onError={() =>
              addToast({ type: "error", message: "Не вдалося додати коментар" })
            }
          />
        </div>
      )}
    </div>
  );
}
