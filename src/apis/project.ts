import api, { ResponseApi } from "@libs/apis/api";
import { Project } from "@libs/types";
import { IColumn } from "@libs/types/project";

interface ListProjectsParams {
  page?: number;
  limit?: number;
}

const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// Projects endpoints
export const projects = {
  getAll: () => api.get<Project[]>("/projects", config),
  getById: (id: string) => api.get<Project>(`/projects/${id}`, config),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data, config),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data, config),
  delete: (id: string) => api.delete(`/projects/${id}`, config),
  getUserProjects: (userId: string) => api.get<ResponseApi<Project[]>>(`/projects/user/${userId}`, config),
  listProjects: (params: ListProjectsParams = { page: 1, limit: 10 }) => api.get<ResponseApi<Project>>("/projects", { ...config, params }),
  getColumns: (projectId: string) => api.get<ResponseApi<IColumn[]>>(`/projects/${projectId}/columns`, config),
};
