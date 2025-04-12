import api, { ResponseApi } from "@libs/apis/api";
import { IIssue } from "@libs/types/issue";
// Parameters for creating an issue
export interface CreateIssueParams {
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: "Bug" | "Task" | "Story" | "Epic";
  sprint_id?: string;
  assignee_id?: string;
  attachments?: string[];
  project_id: string;
  reporter_id?: string;
}
interface ListIssuesParams {
  page?: number;
  limit?: number;
  sprint_id?: string;
}

const config = {
  withCredentials: true,
};

// Issues endpoints
export const issues = {
  list: (projectId: string, params: ListIssuesParams = { page: 1, limit: 10 }) =>
    api.get<ResponseApi<IIssue[]>>(`/project/${projectId}/issues`, {
      ...config,
      params,
    }),

  getById: (projectId: string, issueId: string) => api.get<IIssue>(`/project/${projectId}/issues/${issueId}`, config),

  // Create a new issue
  create: (projectId: string, data: CreateIssueParams) => api.post<IIssue>(`/project/${projectId}/issues`, data, config),

  // Update an existing issue
  update: (projectId: string, issueId: string, data: Partial<CreateIssueParams>) => api.put<IIssue>(`/project/${projectId}/issues/${issueId}`, data, config),

  // Delete an issue
  delete: (projectId: string, issueId: string) => api.delete<unknown>(`/project/${projectId}/issues/${issueId}`, config),
};
