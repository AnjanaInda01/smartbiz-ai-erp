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
import OwnerCreatePurchasePage from "./pages/owner/CreatePurchasePage";
import OwnerReportsPage from "./pages/owner/ReportsPage";
import OwnerAiInsightsPage from "./pages/owner/AiInsightsPage";
import OwnerSalesPage from "./pages/owner/SalesPage";
import OwnerStaffManagementPage from "./pages/owner/StaffManagementPage";
import StaffProductsPage from "./pages/staff/ProductsPage";
import StaffCustomersPage from "./pages/staff/CustomersPage";
import StaffSuppliersPage from "./pages/staff/SuppliersPage";
import StaffPurchasesPage from "./pages/staff/PurchasesPage";
import StaffCreatePurchasePage from "./pages/staff/CreatePurchasePage";
import StaffInvoicesPage from "./pages/staff/InvoicesPage";
import StaffInvoiceDetailPage from "./pages/staff/InvoiceDetailPage";
import StaffAiContentPage from "./pages/staff/AiContentPage";
import AdminSubscriptionPlansPage from "./pages/admin/SubscriptionPlansPage";
import AdminBusinessesPage from "./pages/admin/BusinessesPage";
import AdminAiUsagePage from "./pages/admin/AiUsagePage";
import AdminSystemStatisticsPage from "./pages/admin/SystemStatisticsPage";
import ProfilePage from "./pages/ProfilePage";
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
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/sales"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerSalesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/products"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/customers"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerCustomersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/invoices"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerInvoicesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/invoices/:id"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerInvoiceDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/subscription"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerSubscriptionPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/suppliers"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerSuppliersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/purchases"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerPurchasesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/purchases/create"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerCreatePurchasePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/reports"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/ai-insights"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerAiInsightsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/staff"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <OwnerStaffManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/profile"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* STAFF area */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/products"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/customers"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffCustomersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/suppliers"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffSuppliersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/purchases"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffPurchasesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/purchases/create"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffCreatePurchasePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/invoices"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffInvoicesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/invoices/:id"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffInvoiceDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/ai-content"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <StaffAiContentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute allowRoles={["STAFF"]}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN area */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <AdminBusinessesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ai-usage"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <AdminAiUsagePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <AdminSystemStatisticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscription-plans"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <AdminSubscriptionPlansPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
