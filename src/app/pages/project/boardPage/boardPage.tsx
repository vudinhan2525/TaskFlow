import KanbanBoard from "@libs/app/components/projects/board/kanbanBoard";
import React from "react";
import { Helmet } from "react-helmet-async";
import IssueDetailModal from "@libs/app/components/projects/modals/issueDetailModal";
import { useIssueStore } from "@libs/store/useIssueStore";

const BoardPage: React.FC = () => {
  const { closeIssueDetail } = useIssueStore();

  React.useEffect(() => {
    closeIssueDetail();
  }, []);
  return (
    <div className="h-full bg-white">
      <Helmet>
        <title>Board - Task Flow</title>
      </Helmet>

      <KanbanBoard />
      <IssueDetailModal />
    </div>
  );
};

export default BoardPage;
