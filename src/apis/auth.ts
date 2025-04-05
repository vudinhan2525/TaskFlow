import api from "@libs/apis/api";

export const auth = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/users/login", credentials, {
      withCredentials: true,
    }),
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>("/auth/register", data),
  getCurrentUser: () => api.get<User>("/auth/me"),
};
