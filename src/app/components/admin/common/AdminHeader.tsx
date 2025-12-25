import React, { useState } from "react";
import { Bell, User, Search, Menu, LogOut, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";

interface AdminHeaderProps {
  sidebarCollapsed?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ sidebarCollapsed }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: "New user registered", time: "5 min ago", unread: true },
    { id: 2, text: "Project updated", time: "10 min ago", unread: true },
    {
      id: 3,
      text: "System maintenance scheduled",
      time: "1 hour ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="max-w-2xl flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search users, projects, or anything..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="ml-6 flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <span className="text-xs font-medium text-blue-600">
                      {notifications.filter((n) => n.unread).length} new
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${notif.unread ? "bg-blue-50/50" : ""} `}
                    >
                      <p className="text-sm text-gray-900">{notif.text}</p>
                      <p className="mt-1 text-xs text-gray-500">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 px-4 py-3 text-center">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-xl py-2 pr-4 pl-3 transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold text-gray-900">
                  {currentUser?.first_name} {currentUser?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role || "Admin"}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <div className="py-2">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
