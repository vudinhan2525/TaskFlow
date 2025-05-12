import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@libs/hooks/useAuth";

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
    <div className="flex h-screen flex-col bg-white">
      <ProjectNavbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
