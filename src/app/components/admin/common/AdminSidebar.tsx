import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

export type AdminTab = "dashboard" | "users" | "projects" | "notifications";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  active,
  onClick,
  collapsed,
  badge,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative mx-3 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out ${
      active
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
        : "text-gray-600 hover:bg-white hover:shadow-sm"
    } `}
  >
    <div
      className={` ${active ? "text-white" : "text-gray-500 group-hover:text-blue-600"} transition-colors duration-200`}
    >
      {icon}
    </div>

    {!collapsed && (
      <>
        <span className="flex-1 text-sm font-medium">{label}</span>
        {badge && badge > 0 && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"} `}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </>
    )}

    {collapsed && badge && badge > 0 && (
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </Link>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
}) => {
  const menuItems = [
    {
      to: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      tab: "dashboard" as AdminTab,
    },
    {
      to: "/admin/dashboard/users",
      icon: <Users className="h-5 w-5" />,
      label: "Users",
      tab: "users" as AdminTab,
    },
    {
      to: "/admin/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
      label: "Projects",
      tab: "projects" as AdminTab,
    },
    {
      to: "/admin/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      tab: "notifications" as AdminTab,
      badge: 12,
    },
  ];

  return (
    <div
      className={`border-r border-gray-200 bg-white shadow-xl transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"} relative flex flex-col`}
    >
      {/* Logo Section */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-xl font-bold text-transparent">
                Admin Portal
              </h1>
              <p className="mt-1 text-xs text-gray-500">Management System</p>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 py-6">
        {menuItems.map((item) => (
          <NavItem
            key={item.tab}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.tab}
            onClick={() => onTabChange(item.tab)}
            collapsed={collapsed}
            badge={item.badge}
          />
        ))}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-100 p-4">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-gray-50 ${collapsed ? "justify-center" : ""} `}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-20 -right-3 rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-lg transition-all duration-200 hover:scale-110 hover:text-blue-600 hover:shadow-xl"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default AdminSidebar;
