import api, { ResponseApi } from "@libs/apis/api";
import { IProjectMember } from "@libs/types/projectMember";
import { IUser } from "@libs/types/user";

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const projectMembers = {
  add: (projectId: string, userId: string, role: string) =>
    api.post<ResponseApi<IProjectMember>>(`/projects/${projectId}/members`, { userId, role }, config),

  getUserByEmail: (email: string) =>
    api.get<ResponseApi<IUser>>(`/users/by-email/${email}`, config),

  list: (projectId: string) =>
    api.get<ResponseApi<IProjectMember[]>>(`/projects/${projectId}/members`, config),

  getUserMemberships: (userId: string) =>
    api.get<ResponseApi<IProjectMember[]>>(`/users/${userId}/memberships`, config),

  approve: (projectId: string, userId: string) =>
    api.put<ResponseApi<IProjectMember>>(`/projects/${projectId}/members/${userId}/approve`, {}, config),

  reject: (projectId: string, userId: string) =>
    api.put<ResponseApi<void>>(`/projects/${projectId}/members/${userId}/reject`, {}, config),

  // User-side invitation management
  acceptInvitation: (projectId: string) =>
    api.put<ResponseApi<IProjectMember>>(`/projects/${projectId}/invitations/accept`, {}, config),

  rejectInvitation: (projectId: string) =>
    api.put<ResponseApi<void>>(`/projects/${projectId}/invitations/reject`, {}, config),
};
