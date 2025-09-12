import KanbanBoard from "@libs/app/components/projects/board/kanbanBoard";
import React from "react";
import { Helmet } from "react-helmet-async";
import IssueDetailModal from "@libs/app/components/projects/modals/issueDetailModal";

const BoardPage: React.FC = () => {
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
