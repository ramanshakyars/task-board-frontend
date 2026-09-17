import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {

  if (!AuthService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !AuthService.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;