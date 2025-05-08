import { IUser } from "./user";
import { IProject } from "./project";

export interface IProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  temm_member_role: TeamMemberRole;
  is_pending: boolean;
  created_at: string;
  updated_at: string;

  ///naviation properties
  user: IUser;
  project: IProject;
}

export type TeamMemberRole = "ADMIN" | "MEMBER" | "OWNE ";
