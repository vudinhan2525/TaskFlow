export type IssueStatus = "To Do" | "In Progress" | "Done";
export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  assignee: string;
  reporter?: string;
  priority?: IssuePriority;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  boards: Board[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Column {
  id: string;
  name: string;
  issues: Issue[];
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  status: "Planning" | "Active" | "Completed";
  goal?: string;
  issues: Issue[];
  createdAt?: Date;
  updatedAt?: Date;
}
