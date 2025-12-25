import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { useAuth } from "@libs/hooks/useAuth";

const AdminRoute = (): React.ReactElement => {
  const { isLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for admin role first
  if (!user || user.role !== "Admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect /admin to /admin/dashboard
  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
