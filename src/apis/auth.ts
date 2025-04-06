import api, { ResponseApi } from "@libs/apis/api";
import { CreateUserRequest, IUser, LoginUserRequest } from "@libs/types/user";

export const auth = {
  login: (credentials: LoginUserRequest) =>
    api.post<ResponseApi<IUser>>("/users/login", credentials, {
      withCredentials: true,
    }),
  register: (data: CreateUserRequest) => api.post<ResponseApi<IUser>>("/users/register", data),
  getCurrentUser: () => api.get<ResponseApi<IUser>>("/users/get-me", { withCredentials: true }),
};
