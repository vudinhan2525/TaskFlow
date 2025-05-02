import React from "react";
import Roadmap from "@libs/app/components/projects/roadmap/roadmap";
import { useParams } from "react-router-dom";
import { useProjectIssues } from "@libs/hooks/useIssue";

const RoadmapPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { issues } = useProjectIssues({
    project_id: projectId,
  });

  return (
    <div className="w-full py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Project Roadmap</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage project timeline, milestones, and dependencies</p>
      </div>
      <Roadmap projectId={projectId} issues={issues} />
    </div>
  );
};

export default RoadmapPage;
