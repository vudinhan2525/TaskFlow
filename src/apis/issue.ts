import api from "@libs/apis/api";
import { Issue } from "@libs/types";

const config = {
  withCredentials: true,
};

// Issues endpoints
export const issues = {
  getAll: (projectId: string) => api.get<Issue[]>(`/project/${projectId}/issues`, config),
  getById: (projectId: string, issueId: string) => api.get<Issue>(`/project/${projectId}/issues/${issueId}`, config),
  create: (projectId: string, data: Partial<Issue>) => api.post<Issue>(`/project/${projectId}/issues`, data, config),
  update: (projectId: string, issueId: string, data: Partial<Issue>) =>
    api.patch<Issue>(`/project/${projectId}/issues/${issueId}`, data, config),
  delete: (projectId: string, issueId: string) => api.delete(`/project/${projectId}/issues/${issueId}`, config),
};
