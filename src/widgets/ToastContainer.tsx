import { useUI } from "../app/providers/UIProvider";

export default function ToastContainer() {
  const { toasts, removeToast } = useUI();

  return (
    <div className="fixed bottom-5 right-5 space-y-3 z-[9999] max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`pointer-events-auto flex items-center p-4 rounded-xl border shadow-lg backdrop-blur-md cursor-pointer transition-all duration-300 transform translate-y-0 scale-100 hover:scale-102 active:scale-98 select-none
            ${
              toast.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-950/95 dark:border-emerald-900 dark:text-emerald-300"
                : toast.type === "error"
                  ? "bg-rose-50/90 border-rose-200 text-rose-800 dark:bg-rose-950/95 dark:border-rose-900 dark:text-rose-300"
                  : "bg-indigo-50/90 border-indigo-200 text-indigo-800 dark:bg-indigo-950/95 dark:border-indigo-900 dark:text-indigo-300"
            }`}
        >
          {toast.type === "success" && (
            <svg
              className="w-5 h-5 mr-3 text-emerald-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === "error" && (
            <svg
              className="w-5 h-5 mr-3 text-rose-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          {toast.type === "info" && (
            <svg
              className="w-5 h-5 mr-3 text-indigo-500 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button className="ml-3 text-current opacity-40 hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
