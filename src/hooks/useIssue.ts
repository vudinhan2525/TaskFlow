import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { issues } from "../apis/issue";
import { CreateIssueParams, GetActivitiesParams } from "@libs/types/issue";
import { toast } from "react-toastify";
import { GetIssuesParams } from "@libs/types/issue";

export function useProjectIssues(body: GetIssuesParams) {
  const {
    data: issuesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "issues",
      body.project_id,
      body.sprint_ids,
      body.keyword,
      body.status,
      body.assignee_ids,
      body.column_ids,
      body.page,
    ],
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

export function useCreateIssue({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose?: () => void;
}) {
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
      // toast.success("Issue created successfully!");
      // Invalidate the issues list
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      // If the issue is created with a sprint_id, invalidate that sprint's issues too
      if (response.data.sprint_id) {
        queryClient.invalidateQueries({
          queryKey: ["issues", projectId, response.data.sprint_id],
        });
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

export function useUpdateIssue({
  projectId,
  onClose,
  isNotToasting,
}: {
  projectId: string;
  onClose?: () => void;
  isNotToasting?: boolean;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: updateIssue,
    mutateAsync: updateIssueAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateIssueParams>;
    }) => {
      return issues.update(projectId, id, data);
    },
    onSuccess: (response) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["issue", projectId, variables.id],
      // });
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      if (response.data.sprint_id) {
        queryClient.invalidateQueries({
          queryKey: ["issues", projectId, response.data.sprint_id],
        });
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

export function useDeleteIssue({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteIssue,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (issueId: string) => issues.delete(projectId, issueId),
    onSuccess: () => {
      // toast.success("Issue deleted successfully!");
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

export function useActivities(params: GetActivitiesParams) {
  const {
    data: activitiesRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities", params.issue_id],
    queryFn: async () => {
      const response = await issues.getActivities(params);
      return response.data;
    },
  });

  return {
    activities: activitiesRes?.data,
    isLoading,
    error,
  };
}
