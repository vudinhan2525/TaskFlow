import api, { ResponseApi } from "@libs/apis/api";
import { IProjectMember, AddProjectMemberParams, ListProjectMemberParams } from "@libs/types/projectMember";
import { IUser } from "@libs/types/user";

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};



export const projectMembers = {
  add: (
    data: AddProjectMemberParams,
  ) => api.post<IProjectMember>(`/projects/${data.project_id}/members`, data, config),

  getUserByEmail: (email: string) =>
    api.get<ResponseApi<IUser>>(`/users/by-email/${email}`, config),

  list: ( params: ListProjectMemberParams) =>{
    const url = `/projects/${params.project_id}/members${params.name ? `?name=${params.name}` : ""}${params.email ? `&email=${params.email}` : ""}`;
    return api.get<ResponseApi<IProjectMember[]>>(url, { ...config });
  },

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
