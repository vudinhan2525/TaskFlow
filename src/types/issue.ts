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
  status: IssueStatus;
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
  status?: IssueStatus;
  page?: number | string;
  limit?: number | string;
}
