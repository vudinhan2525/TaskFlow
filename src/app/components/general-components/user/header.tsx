import { useState } from "react";
import { mockUser } from "./mockData";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import DropdownAntd from "../dropdown";
import Image from "../image";
import logo from "@libs/assets/taskflow.png";
import Button from "../button";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import { useNavigate } from "react-router-dom";
import CreateIssueModal from "../../projects/modals/createIssueModal";
import { useCreateIssue } from "@libs/hooks/useIssue";
import { CreateIssueParams } from "@libs/apis/issue";
import { IIssue } from "@libs/types/issue";
import { useUserProjects } from "@libs/hooks/useProject";
export const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  // Using mock data
  const currentUser = mockUser;

  const { projects } = useUserProjects();

  const { createIssueAsync } = useCreateIssue({
    projectId: selectedProject,
    onClose: () => setIsCreateIssueModalOpen(false),
  });

  const handleCreateIssue = () => {
    setIsCreateIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setIsCreateIssueModalOpen(false);
  };

  const handleSubmitIssue = async (formData: Partial<IIssue>) => {
    if (!selectedProject || !user?.id || !formData.title || !formData.type || !formData.priority) {
      console.error("Missing required fields or not logged in");
      return;
    }

    try {
      const issueData: CreateIssueParams = {
        title: formData.title,
        description: formData.description || "",
        status: formData.status || "To Do",
        priority: formData.priority,
        type: formData.type,
        project_id: selectedProject,
        reporter_id: user.id,
        assignee_id: formData.assignee_id,
        sprint_id: formData.sprint_id,
        attachments: [],
      };
      await createIssueAsync(issueData);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
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
                  setSelectedProject(option.value);
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
            <input
              type="text"
              placeholder="Search for issue..."
              className="px-4 py-2 border border-gray-300 outline-[#1447e6] rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          {isAuthenticated && (
            <Button className="" onClick={handleCreateIssue} disabled={!selectedProject}>
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

      <CreateIssueModal isOpen={isCreateIssueModalOpen} onClose={handleCloseIssueModal} onSubmit={handleSubmitIssue} />
    </>
  );
};
