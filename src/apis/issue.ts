import api from "@libs/apis/api";

// Define the Issue interface
export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project_id: string;
  sprint_id?: string;
  assignee_id?: string;
  type: "Bug" | "Task" | "Story" | "Epic";
  attachments: string[];
  reporter_id?: string;
  created_at: string;
  updated_at: string;
}

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

// Parameters for listing issues with pagination
interface ListIssuesParams {
  page?: number;
  limit?: number;
  sprint_id?: string;
}

// Paginated response structure
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const config = {
  withCredentials: true,
};

// Issues endpoints
export const issues = {
  list: (projectId: string, params: ListIssuesParams = { page: 1, limit: 10 }) =>
    api.get<PaginatedResponse<Issue>>(`/project/${projectId}/issues`, {
      ...config,
      params,
    }),

  getById: (projectId: string, issueId: string) => api.get<Issue>(`/project/${projectId}/issues/${issueId}`, config),

  // Create a new issue
  create: (projectId: string, data: CreateIssueParams) => api.post<Issue>(`/project/${projectId}/issues`, data, config),

  // Update an existing issue
  update: (projectId: string, issueId: string, data: Partial<CreateIssueParams>) =>
    api.put<Issue>(`/project/${projectId}/issues/${issueId}`, data, config),

  // Delete an issue
  delete: (projectId: string, issueId: string) =>
    api.delete<unknown>(`/project/${projectId}/issues/${issueId}`, config),
};
