import { IIssue } from "@libs/types/issue";

export interface IProject {
  id: string;
  name: string;
  key: string;
  access: string;
  type: "Kanban" | "Scrum";
  owner_id: string;
  created_at: string;
  updated_at: string;
}
export interface IColumn {
  id: string;
  name: string;
  order: number;
  issues: IIssue[];
  project_id: string;
  created_at: string;
  updated_at: string;
}
