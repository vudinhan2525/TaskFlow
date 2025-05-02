import KanbanBoard from "@libs/app/components/projects/board/kanbanBoard";
import React from "react";

const BoardPage: React.FC = () => {
  return (
    <div className="h-full bg-white">
      <KanbanBoard />
    </div>
  );
};

export default BoardPage;
