import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { mockProjects } from "./mockData";

export const Sidebar = () => {
  const location = useLocation();
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(true);
  const currentProject = mockProjects[0]; // Using first project as current for demo

  const navigationItems = [
    {
      title: "Planning",
      items: [
        { name: "Roadmap", path: `/projects/${currentProject.key}/roadmap`, icon: "timeline" },
        { name: "Backlog", path: `/projects/${currentProject.key}/backlog`, icon: "list" },
        { name: "Active sprints", path: `/projects/${currentProject.key}/sprints`, icon: "bolt" },
        { name: "Reports", path: `/projects/${currentProject.key}/reports`, icon: "assessment" },
      ],
    },
    {
      title: "Development",
      items: [
        { name: "Code", path: `/projects/${currentProject.key}/code`, icon: "code" },
        { name: "Releases", path: `/projects/${currentProject.key}/releases`, icon: "local_shipping" },
      ],
    },
  ];

  const renderIcon = (iconName: string) => {
    return <span className="material-icons text-gray-600 mr-2 text-xl">{iconName}</span>;
  };

  return (
    <div className="w-64 bg-gray-100 h-screen overflow-y-auto border-r border-gray-200">
      {/* Project Section */}
      <div className="p-4 border-b border-gray-200">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
        >
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${currentProject.name}`}
              alt={currentProject.name}
              className="w-8 h-8 rounded"
            />
            <div className="ml-2">
              <div className="font-medium text-sm">{currentProject.name}</div>
              <div className="text-xs text-gray-500">Software project</div>
            </div>
          </div>
          <span className="material-icons text-gray-400">{isProjectMenuOpen ? "expand_less" : "expand_more"}</span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        {navigationItems.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm ${
                  location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {renderIcon(item.icon)}
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Project Settings */}
      <div className="mt-auto border-t border-gray-200">
        <Link
          to={`/projects/${currentProject.key}/settings`}
          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-200"
        >
          {renderIcon("settings")}
          Project settings
        </Link>
      </div>
    </div>
  );
};
