import axios from "axios";
import { Project, Issue, Team, User, Sprint, Board } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/",
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
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
