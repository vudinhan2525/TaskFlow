import api from "@libs/apis/api";

export interface Sprint {
  id: string;
  name: string;
  date_started: string;
  date_ended: string;
  duration: number;
  goal: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}

interface CreateSprintParams {
  name: string;
  date_started: string;
  date_ended: string;
  duration: number;
  goal: string;
  project_id: string;
}

interface ListSprintsParams {
  page?: number;
  limit?: number;
}

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

export const sprints = {
  create: (projectId: string, data: CreateSprintParams) =>
    api.post<Sprint>(`/project/${projectId}/sprints`, data, config),
  getById: (projectId: string, id: string) => api.get<Sprint>(`/project/${projectId}/sprints/${id}`, config),
  update: (projectId: string, id: string, data: Partial<CreateSprintParams>) =>
    api.put<Sprint>(`/project/${projectId}/sprints/${id}`, data, config),
  delete: (id: string) => api.delete(`/sprints/${id}`, config),
  list: (projectId: string, params: ListSprintsParams = { page: 1, limit: 10 }) =>
    api.get<PaginatedResponse<Sprint>>(`/project/${projectId}/sprints`, {
      ...config,
      params,
    }),
};
