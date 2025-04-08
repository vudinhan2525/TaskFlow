import api from "@libs/apis/api";
import { Sprint } from "@libs/types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface CreateSprintParams {
  name: string;
  dateStarted: string;
  dateEnded: string;
  duration: number;
  goal?: string;
}

interface ListSprintsParams {
  page?: number;
  limit?: number;
}

// Sprint endpoints
export const sprints = {
  create: (projectId: string, data: CreateSprintParams) => api.post<Sprint>(`project/${projectId}/sprints`, data),

  getById: (projectId: string, sprintId: string) => api.get<Sprint>(`project/${projectId}/sprints/${sprintId}`),

  update: (projectId: string, sprintId: string, data: Partial<CreateSprintParams>) =>
    api.put<Sprint>(`project/${projectId}/sprints/${sprintId}`, data),

  delete: (projectId: string, sprintId: string) => api.delete(`project/${projectId}/sprints/${sprintId}`),

  list: (projectId: string, params: ListSprintsParams = { page: 1, limit: 10 }) =>
    api.get<PaginatedResponse<Sprint>>(`project/${projectId}/sprints`, { params }),
};
