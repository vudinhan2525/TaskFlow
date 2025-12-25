import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "@libs/app/components/admin/common/AdminHeader";
import AdminSidebar from "@libs/app/components/admin/common/AdminSidebar";

export type AdminTab = "dashboard" | "users" | "projects" | "notifications";

const AdminLayout = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set active tab based on URL path
    if (location.pathname.includes("/admin/dashboard/users")) {
      setActiveTab("users");
    } else if (location.pathname.includes("/admin/dashboard/projects")) {
      setActiveTab("projects");
    } else if (location.pathname.includes("/admin/dashboard/notifications")) {
      setActiveTab("notifications");
    } else if (
      location.pathname === "/admin/dashboard" ||
      location.pathname === "/admin/dashboard/"
    ) {
      setActiveTab("dashboard");
    }
  }, [location.pathname]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (tab === "dashboard") {
      navigate(`/admin/dashboard`);
    } else {
      navigate(`/admin/dashboard/${tab}`);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader sidebarCollapsed={sidebarCollapsed} />

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ activeTab, setActiveTab: handleTabChange }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
