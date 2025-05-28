import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@libs/hooks/useAuth";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";

const ProjectLayout = (): React.ReactElement => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <ProjectNavbar />
      <Outlet />
    </div>
  );
};

export default ProjectLayout;
