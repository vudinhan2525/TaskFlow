import axios from "axios";
import { Project, Issue, Team, User, Sprint, Board } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/login", credentials),
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>("/auth/register", data),
  getCurrentUser: () => api.get<User>("/auth/me"),
};

// Projects endpoints
export const projects = {
  getAll: () => api.get<Project[]>("/projects"),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Issues endpoints
export const issues = {
  getAll: (projectId: string) => api.get<Issue[]>(`/projects/${projectId}/issues`),
  getById: (projectId: string, issueId: string) => api.get<Issue>(`/projects/${projectId}/issues/${issueId}`),
  create: (projectId: string, data: Partial<Issue>) => api.post<Issue>(`/projects/${projectId}/issues`, data),
  update: (projectId: string, issueId: string, data: Partial<Issue>) =>
    api.patch<Issue>(`/projects/${projectId}/issues/${issueId}`, data),
  delete: (projectId: string, issueId: string) => api.delete(`/projects/${projectId}/issues/${issueId}`),
};

// Sprints endpoints
export const sprints = {
  getAll: (projectId: string) => api.get<Sprint[]>(`/projects/${projectId}/sprints`),
  getActive: (projectId: string) => api.get<Sprint>(`/projects/${projectId}/sprints/active`),
  create: (projectId: string, data: Partial<Sprint>) => api.post<Sprint>(`/projects/${projectId}/sprints`, data),
  update: (projectId: string, sprintId: string, data: Partial<Sprint>) =>
    api.patch<Sprint>(`/projects/${projectId}/sprints/${sprintId}`, data),
  delete: (projectId: string, sprintId: string) => api.delete(`/projects/${projectId}/sprints/${sprintId}`),
  start: (projectId: string, sprintId: string) => api.post<Sprint>(`/projects/${projectId}/sprints/${sprintId}/start`),
  complete: (projectId: string, sprintId: string) =>
    api.post<Sprint>(`/projects/${projectId}/sprints/${sprintId}/complete`),
};

// Boards endpoints
export const boards = {
  getAll: (projectId: string) => api.get<Board[]>(`/projects/${projectId}/boards`),
  getById: (projectId: string, boardId: string) => api.get<Board>(`/projects/${projectId}/boards/${boardId}`),
  create: (projectId: string, data: Partial<Board>) => api.post<Board>(`/projects/${projectId}/boards`, data),
  update: (projectId: string, boardId: string, data: Partial<Board>) =>
    api.patch<Board>(`/projects/${projectId}/boards/${boardId}`, data),
  delete: (projectId: string, boardId: string) => api.delete(`/projects/${projectId}/boards/${boardId}`),
};

// Teams endpoints
export const teams = {
  getAll: () => api.get<Team[]>("/teams"),
  getById: (id: string) => api.get<Team>(`/teams/${id}`),
  create: (data: Partial<Team>) => api.post<Team>("/teams", data),
  update: (id: string, data: Partial<Team>) => api.patch<Team>(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
  addMember: (teamId: string, userId: string) => api.post(`/teams/${teamId}/members`, { userId }),
  removeMember: (teamId: string, userId: string) => api.delete(`/teams/${teamId}/members/${userId}`),
};

export default api;
