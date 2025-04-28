import { IssueStatus, IssuePriority } from "@libs/types/issue";

export type Task = {
  id: string;
  title: string;
  date: Date;
  type: "Bug" | "Task" | "Story" | "Epic";
  status: IssueStatus;
  priority: IssuePriority;
  assignee: {
    initials: string;
    name: string;
  };
};
