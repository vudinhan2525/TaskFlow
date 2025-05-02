import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { issues, type CreateIssueParams } from "../apis/issue";
import { toast } from "react-toastify";
import { GetIssuesParams } from "@libs/types/issue";

export function useProjectIssues(body: GetIssuesParams) {
  const {
    data: issuesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues", body.project_id, body.sprint_id, body.keyword],
    queryFn: async () => {
      const response = await issues.list(body);
      return response.data;
    },
  });

  return {
    issues: issuesData?.data || [],
    pagination: issuesData?.pagination,
    isLoading,
    error,
  };
}

export function useIssue(projectId: string, issueId: string) {
  const {
    data: issue,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issue", projectId, issueId],
    queryFn: async () => {
      const { data } = await issues.getById(projectId, issueId);
      return data;
    },
    enabled: !!projectId && !!issueId,
  });

  return {
    issue,
    isLoading,
    error,
  };
}

export function useCreateIssue({ projectId, onClose }: { projectId: string; onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    mutate: createIssue,
    mutateAsync: createIssueAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: CreateIssueParams) => issues.create(projectId, data),
    onSuccess: (response) => {
      toast.success("Issue created successfully!");
      // Invalidate the issues list
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      // If the issue is created with a sprint_id, invalidate that sprint's issues too
      if (response.data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ["issues", projectId, response.data.sprint_id] });
      }
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to create issue");
    },
  });

  return {
    createIssue,
    createIssueAsync,
    isLoading,
    isSuccess,
    error,
  };
}

export function useUpdateIssue({ projectId, onClose, isNotToasting }: { projectId: string; onClose?: () => void; isNotToasting?: boolean }) {
  const queryClient = useQueryClient();

  const {
    mutate: updateIssue,
    mutateAsync: updateIssueAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateIssueParams> }) => issues.update(projectId, id, data),
    onSuccess: (response, variables) => {
      if (!isNotToasting) toast.success("Issue updated successfully!");
      // Invalidate the specific issue
      queryClient.invalidateQueries({ queryKey: ["issue", projectId, variables.id] });
      // Invalidate the issues list
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      // If the issue has a sprint_id, invalidate that sprint's issues too
      if (response.data.sprint_id) {
        queryClient.invalidateQueries({ queryKey: ["issues", projectId, response.data.sprint_id] });
      }
      if (onClose) onClose();
    },
    onError: () => {
      if (!isNotToasting) toast.error("Failed to update issue");
    },
  });

  return {
    updateIssue,
    updateIssueAsync,
    isLoading,
    isSuccess,
    error,
  };
}

export function useDeleteIssue({ projectId, onClose }: { projectId: string; onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteIssue,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (issueId: string) => issues.delete(projectId, issueId),
    onSuccess: () => {
      toast.success("Issue deleted successfully!");
      // Invalidate all issue-related queries for this project
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to delete issue");
    },
  });

  return {
    deleteIssue,
    isLoading,
    isSuccess,
    error,
  };
}
