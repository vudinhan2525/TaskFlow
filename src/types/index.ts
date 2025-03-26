export type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user";
  teams: Team[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  key: string; // e.g., "PROJ"
  name: string;
  description?: string;
  team: Team;
  leads: User[];
  members: User[];
  boards: Board[];
  epics: Epic[];
  sprints: Sprint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  type: "scrum" | "kanban";
  columns: {
    id: string;
    name: string;
    status: Status;
    issues: Issue[];
  }[];
  project: Project;
}

export interface Epic {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: Status;
  project: Project;
  issues: Issue[];
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  status: "planning" | "active" | "completed";
  startDate?: Date;
  endDate?: Date;
  issues: Issue[];
  project: Project;
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  key: string; // e.g., "PROJ-123"
  type: "task" | "bug" | "story" | "subtask";
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee?: User;
  reporter: User;
  epic?: Epic;
  sprint?: Sprint;
  parent?: Issue; // For subtasks
  subtasks: Issue[];
  labels: Label[];
  attachments: Attachment[];
  comments: Comment[];
  activityHistory: ActivityHistory[];
  estimate?: number; // Story points or time estimate
  timeSpent?: number;
  timeRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  project: Project;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploader: User;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  issue: Issue;
  attachments: Attachment[];
  mentions: User[];
  parentComment?: Comment;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityHistory {
  id: string;
  type: "created" | "updated" | "commented" | "statusChanged" | "assigned";
  user: User;
  issue: Issue;
  changes?: {
    field: string;
    oldValue: string | number | boolean | Date | null;
    newValue: string | number | boolean | Date | null;
  };
  createdAt: Date;
}
