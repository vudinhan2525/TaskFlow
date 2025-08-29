import { useState,lazy } from "react";
import { FaGear } from "react-icons/fa6";
import { useAuth } from "@libs/hooks/useAuth";
import DropdownAntd from "../dropdown";
import Image from "../image";
import logo from "@libs/assets/taskflow.png";
import Button from "../button";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { useNavigate } from "react-router-dom";
import { useUserProjects } from "@libs/hooks/useProject";
import SearchHeader from "@libs/app/components/general-components/user/search";

// Lazy load Component
const NotificationsPopover= lazy(() => import("../../notifications/notificationsPopover"));
const ProjectInvitationsPopover= lazy(() => import("../../projects/projectInvitationsPopover"));
const CreateIssueModal= lazy(() => import("../../projects/modals/createIssueModal"));

export const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { projects } = useUserProjects();

  const handleOpenCreateIssue = () => {
    setIsCreateIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setIsCreateIssueModalOpen(false);
  };
  return (
    <div>
      <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        {/* Left section - Logo and dropdowns */}
        <div className="flex w-1/4 items-center space-x-4">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center"
            onClick={() => navigate("/")}
          >
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
                parent={
                  <div className="flex items-center space-x-2">Projects</div>
                }
              />
            </div>
          )}
        </div>

        {/*Middle section - Search and Add more*/}
        <div className="flex w-1/2 items-center justify-center space-x-4">
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
          <div className="flex w-1/4 items-center justify-end space-x-2">
            {/* Notifications */}
            <NotificationsPopover />
            {/* Project Invitations */}
            <ProjectInvitationsPopover userId={user?.data?.id || ""} />
            {/* Settings Icon */}
            <div
              className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => navigate("/settings")}
            >
              <FaGear />
            </div>

            {/* User Menu */}
            <div className="relative">
              <div
                className="flex items-center space-x-2 text-red-500"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <p className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.data?.first_name?.[0]}
                  </span>
                </p>
              </div>
              {isUserDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-medium">{`${user?.data?.first_name} ${user?.data?.last_name}`}</p>
                    <p className="text-sm text-gray-600">{user?.data?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Profile
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Settings
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          setIsUserDropdownOpen(false);
                          await logout();
                          navigate("/login", { replace: true });
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!isAuthenticated && (
          <div className="flex min-w-1/4 items-center justify-center">
            <Button
              className="w-[100px]"
              onClick={() => navigate("/login")}
              variant="outline"
            >
              <span className="text-base font-semibold">Login</span>
            </Button>
          </div>
        )}
      </header>

      {isCreateIssueModalOpen && (
        <CreateIssueModal
          isOpen={isCreateIssueModalOpen}
          onClose={handleCloseIssueModal}
        />
      )}
    </div>
  );
};
