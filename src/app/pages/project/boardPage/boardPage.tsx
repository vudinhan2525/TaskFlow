import KanbanBoard from "@libs/app/components/projects/board/kanbanBoard";
import { useProjectIssues } from "@libs/hooks/useIssue";

import React from "react";
import { useParams } from "react-router-dom";

const BoardPage: React.FC = () => {
  const { projectId } = useParams();
  const { issues } = useProjectIssues(projectId || "");
  const handleIssueMove = async (issueId: string, sourceColumn: string, destinationColumn: string) => {
    console.log(`Move issue ${issueId} from ${sourceColumn} to ${destinationColumn}`);
    // No persistence since this is mock data
  };

  return (
    <div className="h-full bg-white">
      <KanbanBoard issues={issues} onIssueMove={handleIssueMove} />
    </div>
  );
};

export default BoardPage;
