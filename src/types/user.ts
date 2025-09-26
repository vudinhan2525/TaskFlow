export type UserRole = "User" | "Admin";
import { TeamMemberRole } from "./projectMember";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
  avatar?: string;
  projectRole?: TeamMemberRole;
  projectPermission?: string[];
}

export interface GetUserParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}
export interface LoginUserRequest {
  email: string;
  password: string;
}
