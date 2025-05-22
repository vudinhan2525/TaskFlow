import React from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues } from "@libs/hooks/useIssue";

import BackLog from "@libs/app/components/projects/backlog/backlog";

const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();

  const { sprints: initialSprints, isLoading: isLoadingSprints } =
    useProjectSprints(projectId || "");
  const { issues: initialIssues, isLoading: isLoadingIssues } =
    useProjectIssues({
      project_id: projectId,
    });

  return (
    <BackLog
      initialSprints={initialSprints}
      initialIssues={initialIssues}
      isLoadingSprints={isLoadingSprints}
      isLoadingIssues={isLoadingIssues}
    />
  );
};

export default BackLogPage;
