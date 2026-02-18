import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { roleHome } from "./roleRedirect";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
