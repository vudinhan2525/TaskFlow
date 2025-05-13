import api, { ResponseApi } from "@libs/apis/api";
import { IProjectMember } from "@libs/types/projectMember";
import { IUser } from "@libs/types/user";

const config = {
  withCredentials: true,
};

export interface AddProjectMemberParams {
  project_id: string;
  user_id: string;
  role: string;
}

export const projectMembers = {
  add: (
    projectId: string,
    data: AddProjectMemberParams,
  ) => api.post<IProjectMember>(`/projects/${projectId}/members`, data, config),

  getUserByEmail: (email: string) =>
    api.get<ResponseApi<IUser>>(`/users/email/${email}`, config),

  list: (projectId: string) =>
    api.get<ResponseApi<IProjectMember[]>>(
      `/projects/${projectId}/members`,
      config,
    ),
};
