import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { roleHome, isAllowedRole } from "./roleRedirect";
import LoadingScreen from "../components/LoadingScreen";

export default function ProtectedRoute({ allowRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowRoles && !isAllowedRole(user?.role, allowRoles)) {
    return <Navigate to={roleHome(user?.role)} replace />;
  }

  return children;
}
