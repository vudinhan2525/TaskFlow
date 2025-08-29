import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@libs/hooks/useAuth";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import JiraBacklogSkeleton from "../components/skeleton/backlogSkeleton";
const ProjectLayout = (): React.ReactElement => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <JiraBacklogSkeleton />;
  }

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="flex h-screen w-full flex-1 flex-row overflow-hidden">
      <div className="h-full w-[15%]">
        <ProjectNavbar />
      </div>
      <div className="h-screen w-[85%] overflow-auto">
        <Suspense fallback={<div></div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectLayout;
