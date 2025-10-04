import api from "@libs/apis/api";
import { ITeam, CreateTeamParams, UpdateTeamParams } from "@libs/types/team";
import { ResponseApi } from "@libs/apis/api";

const config = {
  withCredentials: true,
};

export const teams = {
  getAll: (projectId: string) =>
    api.get<ResponseApi<ITeam[]>>(`/projects/${projectId}/teams`, config),
  getById: (projectId: string, teamId: string) =>
    api.get<ITeam>(`/projects/${projectId}/teams/${teamId}`, config),
  create: (data: Partial<CreateTeamParams>) => {
    const url = `/projects/${data.project_id}/teams`;
    return api.post<ResponseApi<ITeam>>(url, data, config);
  },
  update: (
    projectId: string,
    teamId: string,
    data: Partial<UpdateTeamParams>,
  ) => {
    const url = `/projects/${projectId}/teams/${teamId}`;
    return api.put<ResponseApi<ITeam>>(url, data, config);
  },
  getUserTeam: (projectId: string, userId: string) => {
    const url = `/projects/${projectId}/members/${userId}/teams`;
    return api.get<ResponseApi<ITeam[]>>(url, config);
  },
  // delete: (id: string) => api.delete(`/teams/${id}`),
  // addMember: (teamId: string, userId: string) => api.post(`/teams/${teamId}/members`, { userId }),
  // removeMember: (teamId: string, userId: string) => api.delete(`/teams/${teamId}/members/${userId}`),
};
