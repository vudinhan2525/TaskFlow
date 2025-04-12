import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { issues, Issue, CreateIssueParams } from "@libs/apis/issue";
import { toast } from "react-toastify";
import { ResponseApi } from "@libs/apis/api";

type CreateIssueRequest = Omit<CreateIssueParams, "project_id"> & {
  sprintId?: string;
  assignee?: string;
};

export function useIssues(projectId: string) {
  const queryClient = useQueryClient();

  const {
    data: issueList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues", projectId],
    queryFn: () => issues.list(projectId),
    enabled: !!projectId,
  });

  const createIssue = useMutation({
    mutationFn: (data: CreateIssueRequest) =>
      issues.create(projectId, {
        ...data,
        project_id: projectId,
        sprint_id: data.sprintId,
        assignee_id: data.assignee,
        attachments: data.attachments || [],
        type: data.type || "Task",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue created successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to create issue");
    },
  });

  const updateIssue = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Issue> }) => issues.update(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue updated successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to update issue");
    },
  });

  const deleteIssue = useMutation({
    mutationFn: (id: string) => issues.delete(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue deleted successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to delete issue");
    },
  });

  return {
    issues: issueList?.data?.data || [],
    pagination: issueList?.data?.pagination,
    isLoading,
    error,
    createIssue,
    updateIssue,
    deleteIssue,
  };
}

export function useIssue(projectId: string, issueId: string) {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issue", projectId, issueId],
    queryFn: () => issues.getById(projectId, issueId),
    enabled: !!projectId && !!issueId,
  });

  const updateIssue = useMutation({
    mutationFn: (data: Partial<Issue>) => issues.update(projectId, issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", projectId, issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue updated successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to update issue");
    },
  });

  const deleteIssue = useMutation({
    mutationFn: () => issues.delete(projectId, issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      toast.success("Issue deleted successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to delete issue");
    },
  });

  return {
    issue: response?.data,
    isLoading,
    error,
    updateIssue,
    deleteIssue,
  };
}
