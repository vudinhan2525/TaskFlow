import { IIssue } from "@libs/types/issue";

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
  issues: IIssue[];
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  dateStarted: string;
  dateEnded: string;
  duration: number;
  goal?: string;
  issues: IIssue[];
  createdAt: string;
  updatedAt: string;
}
