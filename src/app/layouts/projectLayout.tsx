import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import { ClockLoader } from "react-spinners";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";

const ProjectLayout = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();

  //Fetch data for permission check
  const { user } = useAuthStore();

  // First fetch project members to get user role and permissions
  const { isLoading: isLoadingMembers } = useProjectMembers({
    project_id: projectId || "",
    email: user?.email || "",
  });

  // Then fetch user teams only after project members are loaded
  useUserTeams(
    projectId || "",
    user?.id || "",
    !isLoadingMembers, // Only enable when project members are loaded
  );

  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className="flex h-screen w-full flex-1 flex-row overflow-hidden">
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} h-full border-r border-gray-200 transition-all duration-200 ease-in-out`}
      >
        <ProjectNavbar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
        />
      </div>
      <div className="h-screen flex-1 overflow-auto">
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
