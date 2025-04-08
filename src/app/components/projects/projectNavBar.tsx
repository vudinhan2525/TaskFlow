import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaRocket, FaChartBar, FaListAlt, FaTh, FaCalendarAlt, FaCode, FaPlus, FaTasks, FaGlobe } from "react-icons/fa";

interface NavItem {
  label: string;
  icon: React.ReactElement;
  route: string;
}

const ProjectNavbar = (): React.ReactElement => {
  const { projectKey } = useParams<{ projectKey: string }>();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Summary", icon: <FaGlobe />, route: `/projects/${projectKey}/summary` },
    { label: "Board", icon: <FaTh />, route: `/projects/${projectKey}/board` },
    { label: "Backlog", icon: <FaTasks />, route: `/projects/${projectKey}/backlog` },
    { label: "List", icon: <FaListAlt />, route: `/projects/${projectKey}/list` },
    { label: "Roadmap", icon: <FaChartBar />, route: `/projects/${projectKey}/roadmap` },
    { label: "Sprints", icon: <FaCalendarAlt />, route: `/projects/${projectKey}/sprints` },
    { label: "Reports", icon: <FaChartBar />, route: `/projects/${projectKey}/reports` },
    { label: "Settings", icon: <FaCode />, route: `/projects/${projectKey}/settings` },
  ];

  return (
    <div className="flex flex-col bg-white p-2 border-b border-gray-200">
      {/* Project Header */}
      <div className="flex items-center mb-2">
        <FaRocket className="text-emerald-600 text-xl mr-2" />
        <span className="text-base font-semibold text-gray-800">TaskFlow</span>
        <span className="ml-1 text-gray-500">...</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex items-center overflow-x-auto whitespace-nowrap">
        {navItems.map((item) => (
          <Link
            to={item.route}
            key={item.label}
            className={`flex items-center px-3 py-2 mr-1 rounded cursor-pointer transition-colors duration-200 no-underline
              ${
                location.pathname === item.route
                  ? "bg-emerald-100 text-emerald-700 font-medium"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
          >
            <span className="text-base mr-2 text-emerald-700">{item.icon}</span>
            <span className="text-sm text-emerald-600">{item.label}</span>
          </Link>
        ))}
        <div className="flex items-center px-2 py-2 bg-emerald-100 rounded hover:bg-emerald-200 cursor-pointer">
          <FaPlus className="text-emerald-600" />
        </div>
      </nav>
    </div>
  );
};

export default ProjectNavbar;
