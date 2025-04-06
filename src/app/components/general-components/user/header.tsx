import { useState } from "react";
import { mockUser } from "./mockData";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import Image from "@libs/app/components/general-components/image";
import logo from "@libs/assets/taskflow.png";
export const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [project, setProject] = useState("Projects");
  // Using mock data
  const currentUser = mockUser;

  const handleCreateIssue = () => {
    console.log("Create Issue clicked");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 w-full">
      {/* Left section - Logo and dropdowns */}
      <div className="flex items-center space-x-4 w-1/4">
        {/* Logo */}
        <div className="flex items-center">
          <Image src={logo} className="h-[17px] w-[100px]" />
        </div>

        {/* Project Dropdown */}
        <div className="relative">
          <DropdownAntd
            options={[
              { value: "Bluesky", label: "Bluesky" },
              { value: "Redsun", label: "Redsun" },
            ]}
            placement="bottom"
            onClickItem={(value) => setProject(value.value)}
            menuClassName={"min-w-[120px]"}
            rowClassName="font-semibold  text-gray-700"
            parent={project}
          />
        </div>
      </div>
      {/*Middle section - Search and Add more*/}
      <div className="flex items-center space-x-4 w-1/2 justify-center">
        {/* Search Box */}
        <div className="relative w-[60%]">
          <input
            type="text"
            placeholder="Search for issue..."
            className="px-4 py-2 border border-gray-300 outline-[#1447e6] rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaMagnifyingGlass className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        <button
          className="bg-blue-600 text-white px-6 font-semibold cursor-pointer py-2 rounded-md hover:bg-blue-700 "
          onClick={handleCreateIssue}
        >
          Create Issue
        </button>
      </div>
      {/* Right section - Search, notifications, settings, and user */}
      <div className="flex items-center space-x-2 w-1/4 justify-end">
        {/* Notification Icon */}
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
          <FaBell />
        </div>
        {/* Settings Icon */}
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
          <FaGear />
        </div>

        {/* User Menu */}
        <div className="relative">
          <p
            className="flex items-center space-x-2 text-red-500"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
          </p>
          {isUserDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Profile</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Settings</button>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
