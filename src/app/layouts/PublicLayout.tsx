import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden px-4">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-950/20 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-950/20 rounded-full blur-3xl opacity-60"></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-8 rounded-2xl shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
}
