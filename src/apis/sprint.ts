import api from "@libs/apis/api";
import { Sprint } from "@libs/types";

// Sprints endpoints
export const sprints = {
  getAll: (projectId: string) => api.get<Sprint[]>(`/projects/${projectId}/sprints`),
  getActive: (projectId: string) => api.get<Sprint>(`/projects/${projectId}/sprints/active`),
  create: (projectId: string, data: Partial<Sprint>) => api.post<Sprint>(`/projects/${projectId}/sprints`, data),
  update: (projectId: string, sprintId: string, data: Partial<Sprint>) =>
    api.patch<Sprint>(`/projects/${projectId}/sprints/${sprintId}`, data),
  delete: (projectId: string, sprintId: string) => api.delete(`/projects/${projectId}/sprints/${sprintId}`),
  start: (projectId: string, sprintId: string) => api.post<Sprint>(`/projects/${projectId}/sprints/${sprintId}/start`),
  complete: (projectId: string, sprintId: string) =>
    api.post<Sprint>(`/projects/${projectId}/sprints/${sprintId}/complete`),
};
