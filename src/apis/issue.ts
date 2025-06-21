import api, { ResponseApi } from "@libs/apis/api";
import {
  GetIssuesParams,
  IIssue,
  CreateIssueParams,
  GetActivitiesParams,
  IActivity,
} from "@libs/types/issue";

const config = {
  withCredentials: true,
};

export const issues = {
  list: (params: GetIssuesParams) => {
    return api.post<ResponseApi<IIssue[]>>("/issues/list-issue", params, {
      ...config,
    });
  },

  getById: (projectId: string, issueId: string) =>
    api.get<IIssue>(`/issues/project/${projectId}/${issueId}`, config),

  create: (projectId: string, data: CreateIssueParams) =>
    api.post<IIssue>(`/issues/project/${projectId}`, data, config),

  update: (
    projectId: string,
    issueId: string,
    data: Partial<CreateIssueParams>,
  ) => {
    return api.put<IIssue>(
      `/issues/project/${projectId}/${issueId}`,
      data,
      config,
    );
  },

  delete: (projectId: string, issueId: string) =>
    api.delete(`/issues/project/${projectId}/${issueId}`, config),

  getActivities: (data: GetActivitiesParams) =>
    api.post<ResponseApi<IActivity[]>>("/issues/list-activities", data, config),
};
