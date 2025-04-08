import React from "react";
import KanbanBoard from "../../../components/projects/board/kanbanBoard";

import { Issue } from "../../../../types";

const BoardPage: React.FC = () => {
  const mockIssues: Issue[] = [
    {
      id: "1",
      title: "Set up project repo",
      description: "Initialize GitHub repo and set up base project",
      status: "To Do",
      assignee: "John Doe",
    },
    {
      id: "2",
      title: "Create Kanban Board component",
      description: "Design and build the kanban board UI",
      status: "In Progress",
      assignee: "Jane Smith",
    },
    {
      id: "3",
      title: "Fix bug in auth flow",
      description: "Resolve redirect issue after login",
      status: "Done",
      assignee: "Khoa Phan",
    },
  ];

  const handleIssueMove = async (issueId: string, sourceColumn: string, destinationColumn: string) => {
    console.log(`Move issue ${issueId} from ${sourceColumn} to ${destinationColumn}`);
    // No persistence since this is mock data
  };

  return (
    <div className="h-full bg-white">
      <KanbanBoard issues={mockIssues} onIssueMove={handleIssueMove} />
    </div>
  );
};

export default BoardPage;
