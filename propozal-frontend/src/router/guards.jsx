import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth() {
  const { auth } = useAuth();
  return auth?.accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ roles = [] }) {
  const { auth } = useAuth();
  if (!auth?.accessToken) return <Navigate to="/login" replace />;
  return roles.includes(auth.role) ? <Outlet /> : <Navigate to="/forbidden" replace />;
}

export function GuestOnly() {
  const { auth } = useAuth();
  if (auth?.accessToken) {
    const role = auth.role;
    return <Navigate to={role === "ADMIN" ? "/admin/dashboard" : "/sales"} replace />;
  }
  return <Outlet />;
}
