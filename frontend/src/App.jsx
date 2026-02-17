import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";
import { roleHome } from "./auth/roleRedirect";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* Prevent redirect flicker while /me is loading */}
      <Route
        path="/"
        element={
          loading ? null : (
            <Navigate to={user ? roleHome(user.role) : "/login"} replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* OWNER area */}
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        {/* Later:
            <Route path="products" element={<OwnerProducts />} />
            <Route path="customers" element={<OwnerCustomers />} />
        */}
      </Route>

      {/* STAFF area */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
      </Route>

      {/* ADMIN area */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
