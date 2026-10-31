import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminEmail, useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requireAdmin && !isAdminEmail(user.email)) {
    return <Navigate to="/community" replace />;
  }
  return children;
}