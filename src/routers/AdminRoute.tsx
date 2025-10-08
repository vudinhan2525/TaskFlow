import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { useAuth } from "@libs/hooks/apis/useAuth";

const AdminRoute = (): React.ReactElement => {
  const { isLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Always redirect back to admin dashboard when path is just /admin
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check for admin role after loading is complete
  if (!user || user.role !== "Admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
