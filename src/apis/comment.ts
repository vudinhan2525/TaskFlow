import api, { ResponseApi } from "@libs/apis/api";
import {
  CreateCommentParams,
  GetCommentParams,
  IComment,
} from "@libs/types/comment";
const config = {
  withCredentials: true,
};

export const comments = {
  getAll: (param: GetCommentParams) =>
    api.post<ResponseApi<IComment[]>>(`/comments/list-comments`, param, config),
  create: (body: CreateCommentParams) =>
    api.post<ResponseApi<IComment>>(`/comments`, body, config),
};
