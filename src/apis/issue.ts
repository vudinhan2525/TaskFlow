import api from "@libs/apis/api";
import { Issue } from "@libs/types";

// Issues endpoints
export const issues = {
  getAll: (projectId: string) => api.get<Issue[]>(`/projects/${projectId}/issues`),
  getById: (projectId: string, issueId: string) => api.get<Issue>(`/projects/${projectId}/issues/${issueId}`),
  create: (projectId: string, data: Partial<Issue>) => api.post<Issue>(`/issues`, data),
  test: () => api.post<Issue>(`/issues`, { data: {} }, { withCredentials: true }),
  update: (projectId: string, issueId: string, data: Partial<Issue>) =>
    api.patch<Issue>(`/projects/${projectId}/issues/${issueId}`, data),
  delete: (projectId: string, issueId: string) => api.delete(`/projects/${projectId}/issues/${issueId}`),
};
