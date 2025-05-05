import { useState } from "react";
import { mockUser } from "./mockData";
import { FaGear } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import DropdownAntd from "../dropdown";
import Image from "../image";
import logo from "@libs/assets/taskflow.png";
import Button from "../button";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { useNavigate } from "react-router-dom";
import UnifiedIssueModal from "../../projects/modals/unifiedIssueModal";
import { useUserProjects } from "@libs/hooks/useProject";
import SearchHeader from "@libs/app/components/general-components/user/search";
export const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  // Using mock data
  const currentUser = mockUser;

  const { projects } = useUserProjects();

  const handleOpenCreateIssue = () => {
    setIsCreateIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setIsCreateIssueModalOpen(false);
  };
  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 w-full">
        {/* Left section - Logo and dropdowns */}
        <div className="flex items-center space-x-4 w-1/4">
          {/* Logo */}
          <div className="flex items-center">
            <Image src={logo} className="h-[17px] w-[100px]" />
          </div>

          {/* Project Dropdown - Only show when authenticated */}
          {isAuthenticated && projects.length > 0 && (
            <div className="relative">
              <DropdownAntd
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                placement="bottom"
                onClickItem={(option) => {
                  navigate(`/projects/${option.value}`);
                }}
                menuClassName={"min-w-[120px]"}
                rowClassName="font-semibold text-gray-700"
                parent={<div className="flex items-center space-x-2">Projects</div>}
              />
            </div>
          )}
        </div>

        {/*Middle section - Search and Add more*/}
        <div className="flex items-center space-x-4 w-1/2 justify-center">
          {/* Search Box */}
          <div className="relative w-[60%]">
            <SearchHeader />
          </div>
          {isAuthenticated && (
            <Button className="" onClick={handleOpenCreateIssue}>
              <span className="text-base font-semibold">Create Issue</span>
            </Button>
          )}
        </div>

        {/* Right section - Search, notifications, settings, and user */}
        {isAuthenticated && (
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
        )}
        {!isAuthenticated && (
          <div className="min-w-1/4 flex items-center justify-center">
            <Button className="w-[100px]" onClick={() => navigate("/login")} variant="outline">
              <span className="text-base font-semibold">Login</span>
            </Button>
          </div>
        )}
      </header>

      <UnifiedIssueModal isOpen={isCreateIssueModalOpen} onClose={handleCloseIssueModal} />
    </>
  );
};
