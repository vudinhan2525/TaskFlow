import { Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
// import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";
import ProjectLayout from "@libs/app/layouts/projectLayout";
import BacklogPage from "@libs/app/pages/project/backLogPage/backLogPage";
import ListPage from "@libs/app/pages/project/listPage/listPage";
import DefaultLayout from "@libs/app/layouts/defaultLayout";
import LoginPage from "@libs/app/pages/auth/loginPage/loginPage";
import RegisterPage from "@libs/app/pages/auth/registerPage/registerPage";
import ProjectPage from "@libs/app/pages/project/projectPage/projectPage";

// Placeholder components until we implement the real ones
const PlaceholderComponent = ({ title }: { title: string }): React.ReactElement => <div className="p-8 text-center text-gray-600">{title}</div>;

// Lazy load components
const ProjectReport = lazy(() => import("@libs/app/pages/project/reportPage/reportPage"));
const ProjectBoard = lazy(() => import("@libs/app/pages/project/boardPage/boardPage"));
const Roadmap = lazy(() => import("@libs/app/pages/project/roadmapPage/roadmapPage"));
const ActiveSprints = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Active Sprints" /> }));
const ProjectSettings = lazy(() => Promise.resolve({ default: () => <PlaceholderComponent title="Project Settings" /> }));

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const Router = (): React.ReactElement => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Public routes */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
            <Route index element={<ProjectPage />} />
            <Route path=":projectId" element={<ProjectLayout />}>
              <Route index element={<ProjectPage />} />
              <Route path="board" element={<ProjectBoard />} />
              <Route path="summary" element={<ProjectPage />} />
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="list" element={<ListPage />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="sprints" element={<ActiveSprints />} />
              <Route path="reports" element={<ProjectReport />} />
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
