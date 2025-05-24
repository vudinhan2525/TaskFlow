import api, { ResponseApi } from "@libs/apis/api";
import { IUser } from "@libs/types/user";
const config = {
  withCredentials: true,
};

export const users = {
  list: (keyword: string) => {
    return api.get<ResponseApi<IUser[]>>(`/users/list-users?name=${keyword}`, {
      ...config,
    });
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
};
