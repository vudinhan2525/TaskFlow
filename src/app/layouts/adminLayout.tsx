import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "@libs/app/components/admin/common/AdminHeader";
import AdminSidebar from "@libs/app/components/admin/common/AdminSidebar";
import { useState } from "react";

const AdminLayout = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<"users" | "projects">("users");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set active tab based on URL path
    if (location.pathname.includes("/admin/dashboard/users")) {
      setActiveTab("users");
    } else if (location.pathname.includes("/admin/dashboard/projects")) {
      setActiveTab("projects");
    }
  }, [location.pathname]);

  const handleTabChange = (tab: "users" | "projects") => {
    setActiveTab(tab);
    navigate(`/admin/dashboard/${tab}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={
            activeTab === "users" ? "Users Management" : "Projects Management"
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ activeTab, setActiveTab: handleTabChange }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
