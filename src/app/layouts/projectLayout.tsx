import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import React from "react";
import { Outlet } from "react-router-dom";

const ProjectLayout = (): React.ReactElement => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <ProjectNavbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
