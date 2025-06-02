import { Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import ProjectLayout from "@libs/app/layouts/projectLayout";
import BacklogPage from "@libs/app/pages/project/backLogPage/backLogPage";
import ListPage from "@libs/app/pages/project/listPage/listPage";
import DefaultLayout from "@libs/app/layouts/defaultLayout";
import LoginPage from "@libs/app/pages/auth/loginPage/loginPage";
import RegisterPage from "@libs/app/pages/auth/registerPage/registerPage";
import ProjectPage from "@libs/app/pages/project/projectPage/projectPage";
import SettingsPage from "@libs/app/pages/settings/settingsPage";
import SprintDetail from "@libs/app/components/sprints/SprintDetail";
import AdminLoginPage from "@libs/app/pages/admin/login/AdminLoginPage";
import AdminLayout from "@libs/app/layouts/adminLayout";
import AdminRoute from "./AdminRoute";
import UsersPage from "@libs/app/pages/admin/users/UsersPage";
import ProjectsPage from "@libs/app/pages/admin/projects/ProjectsPage";

// Lazy load components
const ProjectReport = lazy(
  () => import("@libs/app/pages/project/reportPage/reportPage"),
);
const ProjectBoard = lazy(
  () => import("@libs/app/pages/project/boardPage/boardPage"),
);
const Roadmap = lazy(
  () => import("@libs/app/pages/project/roadmapPage/roadmapPage"),
);
const ActiveSprints = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="p-8 text-center text-gray-600">Active Sprints</div>
    ),
  }),
);

const ProjectSettings = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="p-8 text-center text-gray-600">Project Settings</div>
    ),
  }),
);

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const Router = (): React.ReactElement => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin routes */}
        <Route path="/admin">
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminLayout />}>
              <Route index element={<UsersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="projects" element={<ProjectsPage />} />
            </Route>
          </Route>
        </Route>

        {/* User routes */}
        <Route
          element={
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="projects">
            <Route index element={<ProjectPage />} />
            <Route path=":projectId" element={<ProjectLayout />}>
              <Route path="board" element={<ProjectBoard />} />
              <Route index path="summary" element={<ProjectReport />} />
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="backlog/:selectedIssue" element={<BacklogPage />} />
              <Route path="list" element={<ListPage />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="sprints" element={<ActiveSprints />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="detail" element={<SprintDetail />} />
            </Route>
          </Route>

          {/* User settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Fallback for user routes */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-gray-600">
                Page not found
              </div>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
