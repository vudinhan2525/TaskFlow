import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { issues } from "../apis/api";
import { updateIssue as updateStoreIssue } from "../store/slices/projectSlice";
import { queryClient } from "../apis/react-query";
import type { Issue } from "../types";

export function useIssues(projectId: string) {
  const dispatch = useDispatch();

  const {
    data: issuesList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues", projectId],
    queryFn: async () => {
      const { data } = await issues.getAll(projectId);
      return data;
    },
    enabled: !!projectId,
  });

  const createIssue = useMutation({
    mutationFn: (data: Partial<Issue>) => issues.create(projectId, data),
    onSuccess: (response) => {
      const newIssue = response.data;
      queryClient.setQueryData<Issue[]>(["issues", projectId], (old = []) => [...old, newIssue]);
    },
  });

  const updateIssue = useMutation({
    mutationFn: ({ issueId, data }: { issueId: string; data: Partial<Issue> }) =>
      issues.update(projectId, issueId, data),
    onSuccess: (response) => {
      const updatedIssue = response.data;
      queryClient.setQueryData<Issue[]>(["issues", projectId], (old = []) =>
        old.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
      );
      dispatch(updateStoreIssue(updatedIssue));
    },
  });

  const deleteIssue = useMutation({
    mutationFn: (issueId: string) => issues.delete(projectId, issueId),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Issue[]>(["issues", projectId], (old = []) =>
        old.filter((issue) => issue.id !== deletedId)
      );
    },
  });

  return {
    issues: issuesList,
    isLoading,
    error,
    createIssue,
    updateIssue,
    deleteIssue,
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

  const updateIssue = useMutation({
    mutationFn: (data: Partial<Issue>) => issues.update(projectId, issueId, data),
    onSuccess: (response) => {
      const updatedIssue = response.data;
      queryClient.setQueryData(["issue", projectId, issueId], updatedIssue);
      queryClient.setQueryData<Issue[]>(["issues", projectId], (old = []) =>
        old.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
      );
    },
  });

  return {
    issue,
    isLoading,
    error,
    updateIssue,
  };
}
