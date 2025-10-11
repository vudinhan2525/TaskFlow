import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
