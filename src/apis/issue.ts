import api, { ResponseApi } from "@libs/apis/api";
import { GetIssuesParams, IIssue, CreateIssueParams } from "@libs/types/issue";
// Parameters for creating an issue

const config = {
  withCredentials: true,
};

// Issues endpoints
export const issues = {
  list: (params: GetIssuesParams) => {
    const url = new URL(`/issues`, window.location.origin);

    if (params.project_id)
      url.searchParams.append("project_id", params.project_id);
    if (params.keyword) url.searchParams.append("keyword", params.keyword);
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());
    if (params.assignee_id)
      url.searchParams.append("assignee_id", params.assignee_id);
    if (params.sprint_id)
      url.searchParams.append("sprint_id", params.sprint_id);
    if (params.status)
      url.searchParams.append("status", params.status.join(","));

    return api.get<ResponseApi<IIssue[]>>(url.pathname + url.search, {
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
