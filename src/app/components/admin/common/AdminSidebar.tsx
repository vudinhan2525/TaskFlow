import React from "react";
import { Users, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminSidebarProps {
  activeTab: "users" | "projects";
  onTabChange: (tab: "users" | "projects") => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <nav className="mt-6">
        <div className="px-6 py-3">
          <Link
            to="/admin/dashboard/users"
            onClick={() => onTabChange("users")}
            className={`flex w-full items-center rounded-lg px-4 py-2 text-left ${
              activeTab === "users"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </Link>
        </div>
        <div className="px-6 py-3">
          <Link
            to="/admin/dashboard/projects"
            onClick={() => onTabChange("projects")}
            className={`flex w-full items-center rounded-lg px-4 py-2 text-left ${
              activeTab === "projects"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FolderOpen className="mr-3 h-5 w-5" />
            Projects
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
