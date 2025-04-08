import api from "@libs/apis/api";
import { Project } from "@libs/types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

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
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data, config),
  delete: (id: string) => api.delete(`/projects/${id}`, config),
  getUserProjects: (userId: string) => api.get<PaginatedResponse<Project>>(`/projects/user/${userId}`, config),
  listProjects: (params: ListProjectsParams = { page: 1, limit: 10 }) =>
    api.get<PaginatedResponse<Project>>("/projects", { ...config, params }),
};
