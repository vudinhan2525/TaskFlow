import { IIssue } from "./issue";

export interface ISprint {
  id: string;
  name: string;
  date_started: string;
  date_ended: string;
  duration: number;
  goal: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  issues?: IIssue[];
}

export interface ISprintStats {
  total_issues: number;
  completed_issues: number;
  total_story_point: number;
  completed_story_point: number;
}

export interface ISprintDailyStats {
  date: string;
  completed_issues: number;
  remaining_issues: number;
}

export interface CreateSprintParams {
  name: string;
  date_started: string;
  date_ended: string;
  duration: number;
  goal: string;
  project_id: string;
}

export interface GetSprintParams {
  project_id: string;
  id: string;
}

export interface UpdateSprintParams extends Partial<CreateSprintParams> {
  id: string;
}

export interface ListSprintsParams {
  page?: number;
  limit?: number;
  project_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}
