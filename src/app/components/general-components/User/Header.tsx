import { useState } from "react";
import { mockUser, mockProjects, mockTeams } from "./mockData";

export const Header = () => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Using mock data
  const currentUser = mockUser;
  const projects = mockProjects;
  const teams = mockTeams;

  const handleCreateIssue = () => {
    console.log("Create Issue clicked");
  };

  const handleProjectChange = (project: (typeof mockProjects)[0]) => {
    console.log("Project selected:", project);
    setIsProjectDropdownOpen(false);
  };

  const handleTeamChange = (team: (typeof mockTeams)[0]) => {
    console.log("Team selected:", team);
    setIsTeamDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-1 bg-white border-b border-gray-200 w-full">
      {/* Left section - Logo and dropdowns */}
      <div className="flex items-center space-x-4 w-1/4">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        </div>

        {/* Project Dropdown */}
        <div className="relative">
          <p onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 9V9h6v6H9z" />
            </svg>
          </p>
          {isProjectDropdownOpen && (
            <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleProjectChange(project)}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Dropdown */}
        <div className="relative">
          <p onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}>
            <i className="fas fa-users w-4 h-4 text-red-500 "></i>
          </p>
          {isTeamDropdownOpen && (
            <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg">
              {teams.map((team) => (
                <button
                  key={team.id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleTeamChange(team)}
                >
                  {team.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/*Middle section - Search and Add more*/}
      <div className="flex items-center space-x-4 w-1/2 justify-center">
        {/* Search Box */}
        <div className="relative w-4/5">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {/* Create Issue Button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-1/5"
          onClick={handleCreateIssue}
        >
          Create Issue
        </button>
      </div>
      {/* Right section - Search, notifications, settings, and user */}
      <div className="flex items-center space-x-4 w-1/4 justify-end">
        {/* Notification Icon */}
        <p className="p-2 hover:bg-gray-100 rounded-full text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </p>

        {/* Settings Icon */}
        <p className="p-2 hover:bg-gray-100 rounded-full text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </p>

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
