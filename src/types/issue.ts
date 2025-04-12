export interface IIssue {
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
export type IssueStatus = "To Do" | "In Progress" | "Done";
export type IssuePriority = "Low" | "Medium" | "High";
