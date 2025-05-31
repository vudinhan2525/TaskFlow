export interface IComment {
  id: string;
  content: string;
  user_id: string;
  issue_id: string;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}
export interface GetCommentParams {
  issue_id?: string;
  page: number;
  limit: number;
}
export interface CreateCommentParams {
  issue_id: string;
  user_id: string;
  content: string;
}
