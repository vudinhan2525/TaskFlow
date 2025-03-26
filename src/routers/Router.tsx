import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
// import { useAuth } from "../hooks/useAuth";
import DefaultLayout from "../app/layouts/DefaultLayout";
import type { ReactNode } from "react";

// Placeholder components until we implement the real ones
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-600">{title}</div>
);

// Lazy load components
// const Login = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Login" /> }));
// const Register = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Register" /> }));
const ProjectBoard = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Board" /> }));
const Backlog = lazy(() => import("../app/components/backlog/Backlog"));
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

const Router = () => {
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
            <Route path=":projectKey">
              <Route index element={<ProjectBoard />} />
              <Route path="board" element={<ProjectBoard />} />
              <Route path="backlog" element={<Backlog />} />
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
