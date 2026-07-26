import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "../entities/user/model/store";
import AppLayout from "./layouts/AppLayout";
import PublicLayout from "./layouts/PublicLayout";
import LoginPage from "../pages/login/LoginPage";
import BusinessTripsPage from "../pages/business-trips/BusinessTripsPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";

// Lazy Loading для сторінки деталей заявки (як вимагає завдання)
const BusinessTripDetailsPage = lazy(() => import("../pages/trip/BusinessTripDetailsPage"));
const CreateBusinessTripPage = lazy(() => import("../pages/business-trips/CreateBusinessTripPage"));

// Loading fallback для Suspense
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Завантаження сторінки...</p>
    </div>
  );
}

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ("employee" | "manager")[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { accessToken, role } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/business-trips" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Private Pages (with AppLayout and global Auth protection) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/business-trips" element={<BusinessTripsPage />} />
          <Route
            path="/business-trips/new"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Suspense fallback={<PageLoader />}>
                  <CreateBusinessTripPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-trips/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <BusinessTripDetailsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Not Found */}
        <Route path="/not-found" element={<NotFoundPage />} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/business-trips" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
