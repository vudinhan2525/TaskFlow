import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import { ClockLoader } from "react-spinners";
import { useUserTeams } from "@libs/hooks/useTeam";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";

const ProjectLayout = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  useUserTeams(projectId || "", user?.id || "");
  return (
    <div className="flex h-screen w-full flex-1 flex-row overflow-hidden">
      <div className="h-full w-[15%] border-r border-gray-200">
        <ProjectNavbar />
      </div>
      <div className="h-screen w-[85%] overflow-auto">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <ClockLoader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectLayout;
