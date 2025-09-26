import { Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
// import type { ReactNode } from "react";
import ChatPage from "@libs/app/pages/chat/ChatPage";
// Lazy load pages
const ProjectLayout = lazy(() => import("@libs/app/layouts/projectLayout"));
import DefaultLayout from "@libs/app/layouts/defaultLayout";
const BacklogPage = lazy(
  () => import("@libs/app/pages/project/backLogPage/backLogPage"),
);
const ListPage = lazy(
  () => import("@libs/app/pages/project/listPage/listPage"),
);

const ProjectPage = lazy(
  () => import("@libs/app/pages/project/projectPage/projectPage"),
);
const SettingsPage = lazy(
  () => import("@libs/app/pages/settings/settingsPage"),
);
const SprintDetail = lazy(
  () => import("@libs/app/components/sprints/SprintDetail"),
);
const AdminLoginPage = lazy(
  () => import("@libs/app/pages/admin/login/AdminLoginPage"),
);
const ProjectSettingsPage = lazy(
  () => import("@libs/app/pages/project/settingPage/settingPage"),
);

const TeamManagementPage = lazy(
  () => import("@libs/app/pages/project/settingPage/teamManagementPage"),
);
const TeamDetailPage = lazy(
  () => import("@libs/app/pages/project/settingPage/teamDetail"),
);

const AdminLayout = lazy(() => import("@libs/app/layouts/adminLayout"));
const AdminRoute = lazy(() => import("./AdminRoute"));
const UsersPage = lazy(() => import("@libs/app/pages/admin/users/UsersPage"));
const ProjectsPage = lazy(
  () => import("@libs/app/pages/admin/projects/ProjectsPage"),
);

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

const VerifyPage = lazy(
  () => import("@libs/app/pages/auth/verifyPage/verifyPage"),
);
const LoginPage = lazy(
  () => import("@libs/app/pages/auth/loginPage/loginPage"),
);
const RegisterPage = lazy(
  () => import("@libs/app/pages/auth/registerPage/registerPage"),
);

const Router = (): React.ReactElement => {
  return (
    <Suspense>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyPage />} />

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

              <Route path="settings" element={<ProjectSettingsPage />}>
                <Route path="teams" element={<TeamManagementPage />} />
                <Route path="teams/:teamId" element={<TeamDetailPage />} />
              </Route>
              
             
            </Route>
          </Route>

          {/* User settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Chat route */}
          <Route path="chat" element={<ChatPage />} />

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
