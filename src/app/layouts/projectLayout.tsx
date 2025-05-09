import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import React from "react";
import { Outlet } from "react-router-dom";

const ProjectLayout = (): React.ReactElement => {
  return (
    <div className="flex h-screen flex-col bg-white">
      <ProjectNavbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
