import api, { ResponseApi } from "@libs/apis/api";
import { GetIssuesParams, IIssue, CreateIssueParams } from "@libs/types/issue";
// Parameters for creating an issue

const config = {
  withCredentials: true,
};

// Issues endpoints
export const issues = {
  list: (params: GetIssuesParams) => {
    return api.post<ResponseApi<IIssue[]>>("/issues/list-issue", params, {
      ...config,
    });
  },

  getById: (projectId: string, issueId: string) =>
    api.get<IIssue>(`/project/${projectId}/issues/${issueId}`, config),

  // Create a new issue
  create: (projectId: string, data: CreateIssueParams) =>
    api.post<IIssue>(`/project/${projectId}/issues`, data, config),

  // Update an existing issue
  update: (
    projectId: string,
    issueId: string,
    data: Partial<CreateIssueParams>,
  ) => {
    return api.put<IIssue>(
      `/project/${projectId}/issues/${issueId}`,
      data,
      config,
    );
  },

  // Delete an issue
  delete: (projectId: string, issueId: string) =>
    api.delete<unknown>(`/project/${projectId}/issues/${issueId}`, config),
};
