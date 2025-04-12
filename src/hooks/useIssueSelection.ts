import { useState, useCallback } from "react";

interface MockIssue {
  id: string;
  title: string;
  description: string;
  assignee: {
    initials: string;
    name: string;
  };
  status: "To Do" | "In Progress" | "Done";
  reporter: {
    initials: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export function useIssueSelection() {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [mockIssue] = useState<MockIssue>({
    id: "TASK-1",
    title: "Implement Issue Sidebar",
    description: "Create a sidebar component to display issue details and allow editing",
    assignee: {
      initials: "KP",
      name: "Khoa Phan",
    },
    status: "In Progress",
    reporter: {
      initials: "KP",
      name: "Khoa Phan",
    },
    created_at: "2024-04-11T08:00:00Z",
    updated_at: "2024-04-11T09:00:00Z",
  });

  const selectIssue = useCallback((id: string | null) => {
    setSelectedIssueId(id);
  }, []);

  return {
    selectedIssueId,
    selectIssue,
    mockIssue,
  };
}
