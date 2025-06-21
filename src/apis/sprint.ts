import api from "@libs/apis/api";
import {
  ISprint,
  CreateSprintParams,
  ListSprintsParams,
  PaginatedResponse,
} from "@libs/types/sprint";

const config = {
  withCredentials: true,
};

export const sprints = {
  create: (projectId: string, data: CreateSprintParams) =>
    api.post<ISprint>(`/sprint/project/${projectId}`, data, config),
  getById: (projectId: string, id: string) =>
    api.get<ISprint>(`/sprint/project/${projectId}/${id}`, config),
  update: (projectId: string, id: string, data: Partial<CreateSprintParams>) =>
    api.put<ISprint>(`/sprint/project/${projectId}/${id}`, data, config),
  delete: (id: string) => api.delete(`/sprint/${id}`, config),
  list: (
    projectId: string,
    params: ListSprintsParams = { page: 1, limit: 10 },
  ) =>
    api.post<PaginatedResponse<ISprint>>(
      `/sprints/list-sprints`,
      { project_id: projectId, page: params.page, limit: params.limit },
      {
        ...config,
      },
    ),
};
