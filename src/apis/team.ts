import api from "@libs/apis/api";

// Teams endpoints
export const teams = {
  getAll: () => api.get<Team[]>("/teams"),
  getById: (id: string) => api.get<Team>(`/teams/${id}`),
  create: (data: Partial<Team>) => api.post<Team>("/teams", data),
  update: (id: string, data: Partial<Team>) => api.patch<Team>(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
  addMember: (teamId: string, userId: string) => api.post(`/teams/${teamId}/members`, { userId }),
  removeMember: (teamId: string, userId: string) => api.delete(`/teams/${teamId}/members/${userId}`),
};
