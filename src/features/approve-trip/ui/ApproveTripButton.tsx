import { useApproveTrip } from "../model/useApproveTrip";

interface ApproveTripButtonProps {
  tripId: string;
  newStatusId: string;
  label: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function ApproveTripButton({
  tripId,
  newStatusId,
  label,
  onSuccess,
  onError,
}: ApproveTripButtonProps) {
  const approveTrip = useApproveTrip();
  
  const handleClick = () => {
    approveTrip.mutate(
      { tripId, newStatusId },
      {
        onSuccess: () => onSuccess?.(),
        onError: () => onError?.(),
      }
    );
  };

  const getButtonClass = () => {
    if (newStatusId === "approved") {
      return "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 text-white focus:ring-2 focus:ring-emerald-500/20";
    }
    return "bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 text-white focus:ring-2 focus:ring-rose-500/20";
  };

  return (
    <button
      onClick={handleClick}
      disabled={approveTrip.isPending}
      className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:pointer-events-none active:scale-97 ${getButtonClass()}`}
    >
      {approveTrip.isPending ? "Оновлюємо..." : label}
    </button>
  );
}
