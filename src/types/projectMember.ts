import { IUser } from "./user";
import { IProject } from "./project";

export interface IProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: TeamMemberRole;
  is_pending: boolean;
  created_at: string;
  updated_at: string;

  ///naviation properties
  user: IUser;
  project: IProject;
}
export interface AddProjectMemberParams {
  project_id: string;
  user_id: string;
  role: TeamMemberRole;
}

export interface AddProjectMemberToTeamParams {
  project_id: string;
  team_id: string;
  user_ids: string[];
}

export interface ListProjectMemberParams {
  project_id: string;
  name?: string;
  email?: string;
  page?: number;
  limit?: number;
}

export type TeamMemberRole = "ADMIN" | "MEMBER" | "OWNER" | "VIEWER";
