import React from "react";
import { Bell, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentUser?.first_name} {currentUser?.last_name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
