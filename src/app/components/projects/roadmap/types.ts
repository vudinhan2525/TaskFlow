export type IssuePriority = "I" | "II" | "III";
export type IssueType = "BUG" | "TASK" | "STORY" | "EPIC";
export type IssueStatus = "TODO" | "ONGOING" | "DONE";

export interface Task {
  id: string;
  title: string;
  date: Date;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: {
    initials: string;
    name: string;
  };
}
