import api, { ResponseApi } from "@libs/apis/api";
import { Project } from "@libs/types";
import {
  CreateColumnProjectParams,
  IColumn,
  ListProjectColumnsParams,
  UpdateColumnOrderParams,
  UpdateColumnProjectParams,
  IPermission,
} from "@libs/types/project";

interface ListProjectsParams {
  page?: number;
  limit?: number;
}

const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// Projects endpoints
export const projects = {
  getAll: () => api.get<Project[]>("/projects", config),
  getById: (id: string) => api.get<Project>(`/projects/${id}`, config),
  create: (data: Partial<Project>) =>
    api.post<Project>("/projects", data, config),
  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data, config),
  delete: (id: string) => api.delete(`/projects/${id}`, config),
  getUserProjects: (userId: string) =>
    api.get<ResponseApi<Project[]>>(`/projects/user/${userId}`, config),
  listProjects: (params: ListProjectsParams = { page: 1, limit: 10 }) =>
    api.get<ResponseApi<Project>>("/projects", { ...config, params }),
  getColumns: (data: ListProjectColumnsParams) =>
    api.post<ResponseApi<IColumn[]>>(
      `/projects/${data.project_id}/columns`,
      data,
      config,
    ),

  getTeams: (projectId: string) =>
    api.get<ResponseApi<{ id: string; name: string }[]>>(
      `/projects/${projectId}/teams`,
      config,
    ),

  addColumns: (body: CreateColumnProjectParams) =>
    api.post<ResponseApi<IColumn>>(`/projects/add-column`, body, config),
  updateOrderColumns: (body: UpdateColumnOrderParams) =>
    api.post<ResponseApi<IColumn[]>>(
      `/projects/${body.projectId}/columns/order`,
      body,
      config,
    ),
  updateColumns: (body: UpdateColumnProjectParams) =>
    api.put<ResponseApi<IColumn>>(
      `/projects/${body.projectId}/columns`,
      body,
      config,
    ),
  deleteColumn: (body: { column_id: string }) =>
    api.delete<ResponseApi<IColumn>>(
      `/projects/columns/${body.column_id}`,
      config,
    ),

  getPermissions: () =>
    api.get<{permissions: IPermission[]}>(`/projects/permissions`, config),
};
