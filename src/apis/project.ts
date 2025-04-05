import api from "@libs/apis/api";
import { Project } from "@libs/types";

// Projects endpoints
export const projects = {
  getAll: () => api.get<Project[]>("/projects"),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};
