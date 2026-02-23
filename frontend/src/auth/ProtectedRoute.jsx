import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isAllowedRole, roleHome } from "./roleRedirect";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProtectedRoute({ children, allowRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !isAllowedRole(user.role, allowRoles)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}
