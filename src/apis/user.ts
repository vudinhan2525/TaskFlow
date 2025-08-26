import api, { ResponseApi } from "@libs/apis/api";
import { UserStats } from "@libs/types/project";
import { IUser } from "@libs/types/user";
const config = {
  withCredentials: true,
};

export const users = {
  list: (keyword?: string) => {
    const url = keyword
      ? `/users/list-users?name=${keyword}`
      : "/users/list-users";
    return api.get<ResponseApi<IUser[]>>(url, config);
  },
  getById: (userId: string) =>
    api.get<ResponseApi<IUser>>(`/users/${userId}`, config),
  update: (userData: Partial<IUser>) =>
    api.patch<ResponseApi<IUser>>(`/users/update`, userData, config),
  getMe: () => api.get<ResponseApi<IUser>>("/users/get-me", config),
  changePassword: (data: {
    user_id: string;
    old_password: string;
    new_password: string;
  }) => api.post<ResponseApi<void>>("/users/change-password", data, config),
  getUserStats: (body: { id: string; is_sprintId: boolean }) =>
    api.post<ResponseApi<UserStats>>(`/users/stats/`, body, config),
  updateUser: ( data: Partial<IUser>) =>
    api.put<ResponseApi<IUser>>(`/users`, data, config),
};
