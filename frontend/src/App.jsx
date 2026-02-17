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
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? roleHome(user.role) : "/login"} replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* OWNER area */}
      <Route
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/owner" element={<OwnerDashboard />} />
        {/* later: /owner/products, /owner/customers, ... */}
      </Route>

      {/* STAFF area */}
      <Route
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/staff" element={<StaffDashboard />} />
      </Route>

      {/* ADMIN area */}
      <Route
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
