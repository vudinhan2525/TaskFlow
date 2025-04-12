export type IssueStatus = "To Do" | "In Progress" | "Done";
export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  title: string;
  project_id: string;
  sprint_id?: string;
  assignee_id: string;
  parent_id?: string;
  reporter_id?: string;
  type: "Bug" | "Task" | "Story" | "Epic";
  status: IssueStatus;
  priority: IssuePriority;
  summary: string;
  description: string;
  story_point: number;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  access: string;
  type: "Kanban" | "Scrum";
  owner_id: string;
  boards?: Board[];
  created_at: string;
  updated_at: string;
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
  dateStarted: string;
  dateEnded: string;
  duration: number;
  goal?: string;
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
}
