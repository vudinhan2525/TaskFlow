import { IColumn } from "@libs/types/project";

export interface IIssue {
  id: string;
  title: string;
  project_id: string;
  sprint_id?: string;
  assignee_id: string;
  parent_id?: string;
  reporter_id?: string;
  team_id?: string;
  type: "Bug" | "Task" | "Story" | "Epic";
  column: IColumn;
  priority: IssuePriority;
  summary: string;
  description: string;
  story_point: number;
  labels?: string[];
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export type IssueStatus = "TO DO" | "IN PROGRESS" | "DONE";
export type IssuePriority = "Low" | "Medium" | "High";

export interface GetIssuesParams {
  project_id?: string;
  keyword?: string;
  sprint_id?: string;
  assignee_id?: string;
  status?: IssueStatus[];
  page?: number | string;
  limit?: number | string;
}

export interface CreateIssueParams {
  title: string;
  summary?: string;
  description?: string;
  column_id: string;
  priority: string;
  type: "Bug" | "Task" | "Story" | "Epic";
  sprint_id?: string;
  assignee_id?: string;
  team_id?: string;
  attachments?: string[];
  project_id: string;
  reporter_id?: string;
  parent_id?: string;
  story_point?: number;
}