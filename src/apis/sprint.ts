import api from "@libs/apis/api";
import {
  Sprint,
  CreateSprintParams,
  ListSprintsParams,
  PaginatedResponse,
} from "@libs/types/sprint";


const config = {
  withCredentials: true,
};

export const sprints = {
  create: (projectId: string, data: CreateSprintParams) =>
    api.post<Sprint>(`/project/${projectId}/sprints`, data, config),
  getById: (projectId: string, id: string) =>
    api.get<Sprint>(`/project/${projectId}/sprints/${id}`, config),
  update: (projectId: string, id: string, data: Partial<CreateSprintParams>) =>
    api.put<Sprint>(`/project/${projectId}/sprints/${id}`, data, config),
  delete: (id: string) => api.delete(`/sprints/${id}`, config),
  list: (
    projectId: string,
    params: ListSprintsParams = { page: 1, limit: 10 },
  ) =>
    api.post<PaginatedResponse<Sprint>>(`/sprints/list-sprints`,{ project_id : projectId, page : params.page, limit : params.limit } ,{
      ...config,
    }),
};
