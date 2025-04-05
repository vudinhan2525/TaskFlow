import api from "@libs/apis/api";
import { Board } from "@libs/types";

// Boards endpoints
export const boards = {
  getAll: (projectId: string) => api.get<Board[]>(`/projects/${projectId}/boards`),
  getById: (projectId: string, boardId: string) => api.get<Board>(`/projects/${projectId}/boards/${boardId}`),
  create: (projectId: string, data: Partial<Board>) => api.post<Board>(`/projects/${projectId}/boards`, data),
  update: (projectId: string, boardId: string, data: Partial<Board>) =>
    api.patch<Board>(`/projects/${projectId}/boards/${boardId}`, data),
  delete: (projectId: string, boardId: string) => api.delete(`/projects/${projectId}/boards/${boardId}`),
};
