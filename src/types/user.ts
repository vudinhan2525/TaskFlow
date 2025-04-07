export type UserRole = "User" | "Admin";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
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
