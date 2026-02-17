import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { roleHome } from "./roleRedirect";
import LoadingScreen from "../components/LoadingScreen";

export default function ProtectedRoute({ allowRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}

