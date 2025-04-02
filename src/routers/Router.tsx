import { Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
// import { useAuth } from "../hooks/useAuth";
import DefaultLayout from "../app/layouts/(user-layout)/layout";
import ProjectLayout from "../app/layouts/(user-layout)/(project)/layout";
import type { ReactNode } from "react";
import ListPage from "@libs/app/layouts/(user-layout)/(project)/list/page";

// Placeholder components until we implement the real ones
const PlaceholderComponent = ({ title }: { title: string }): React.ReactElement => (
  <div className="p-8 text-center text-gray-600">{title}</div>
);

// Lazy load components
// const Login = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Login" /> }));
// const Register = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Register" /> }));
const ProjectBoard = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Board" /> }));
const BacklogPage = lazy(() => import("@libs/app/layouts/(user-layout)/(project)/backlog/page"));
const Roadmap = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Roadmap" /> }));
const ActiveSprints = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Active Sprints" /> }));
const Reports = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Reports" /> }));
const ProjectSettings = lazy(() =>
  Promise.resolve({ default: () => <PlaceholderComponent title="Project Settings" /> })
);

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  // const { user, isLoading } = useAuth();
  // const location = useLocation();

  // if (isLoading) {
  //   return <div className="flex items-center justify-center h-screen">Loading...</div>;
  // }

  // if (!user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
}

const Router = (): React.ReactElement => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Public routes */}

        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect to projects */}
          <Route index element={<Navigate to="/projects" replace />} />

          {/* Projects routes */}
          <Route path="projects">
            <Route
              index
              element={<div className="p-8 text-center text-gray-600">Select a project from the sidebar</div>}
            />
            <Route path=":projectKey" element={<ProjectLayout />}>
              <Route index element={<ProjectBoard />} />
              <Route path="board" element={<ProjectBoard />} />
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="list" element={<ListPage />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="sprints" element={<ActiveSprints />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<ProjectSettings />} />
            </Route>
          </Route>

          {/* Fallback for protected routes */}
          <Route path="*" element={<div className="p-8 text-center text-gray-600">Page not found</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
