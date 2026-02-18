import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import OwnerProductsPage from "./pages/owner/ProductsPage";
import OwnerCustomersPage from "./pages/owner/CustomersPage";
import OwnerInvoicesPage from "./pages/owner/InvoicesPage";
import OwnerInvoiceDetailPage from "./pages/owner/InvoiceDetailPage";
import OwnerSubscriptionPage from "./pages/owner/SubscriptionPage";
import OwnerSuppliersPage from "./pages/owner/SuppliersPage";
import OwnerPurchasesPage from "./pages/owner/PurchasesPage";
import OwnerReportsPage from "./pages/owner/ReportsPage";
import OwnerAiInsightsPage from "./pages/owner/AiInsightsPage";
import StaffProductsPage from "./pages/staff/ProductsPage";
import StaffInvoicesPage from "./pages/staff/InvoicesPage";
import StaffInvoiceDetailPage from "./pages/staff/InvoiceDetailPage";
import AdminSubscriptionPlansPage from "./pages/admin/SubscriptionPlansPage";
import AdminBusinessesPage from "./pages/admin/BusinessesPage";
import AdminAiUsagePage from "./pages/admin/AiUsagePage";
import AdminSystemStatisticsPage from "./pages/admin/SystemStatisticsPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";
import { roleHome } from "./auth/roleRedirect";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          loading ? null : (
            <Navigate to={user ? roleHome(user.role) : "/login"} replace />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />

      {/* OWNER area */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/customers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerCustomersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/invoices"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerInvoicesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/invoices/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerInvoiceDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/subscription"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerSubscriptionPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/suppliers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerSuppliersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/purchases"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerPurchasesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/ai-insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerAiInsightsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* STAFF area */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StaffDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StaffProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/invoices"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StaffInvoicesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/invoices/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StaffInvoiceDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN area */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminBusinessesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ai-usage"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminAiUsagePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminSystemStatisticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscription-plans"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminSubscriptionPlansPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
