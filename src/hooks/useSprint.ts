import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { queryClient } from "../apis/react-query";
import type { Sprint } from "../types";
import { sprints } from "@libs/apis/sprint";
import {
  setSprints,
  setCurrentSprint,
  addSprint,
  updateSprint as updateSprintAction,
  deleteSprint as deleteSprintAction,
  setLoading,
  setError,
} from "../store/slices/sprintSlice";

export function useSprints(projectId: string) {
  const dispatch = useDispatch();

  const {
    data: sprintsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprints", projectId],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const response = await sprints.list(projectId);
        dispatch(setSprints(response.data.data));
        return response.data;
      } catch (error) {
        dispatch(setError((error as Error).message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!projectId,
  });

  const createSprint = useMutation({
    mutationFn: (data: Omit<Sprint, "id" | "issues" | "createdAt" | "updatedAt">) => sprints.create(projectId, data),
    onSuccess: (response) => {
      const newSprint = response.data;
      dispatch(addSprint(newSprint));
      queryClient.setQueryData<Sprint[]>(["sprints", projectId], (old = []) => [...old, newSprint]);
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const updateSprint = useMutation({
    mutationFn: ({ sprintId, data }: { sprintId: string; data: Partial<Sprint> }) =>
      sprints.update(projectId, sprintId, data),
    onSuccess: (response) => {
      const updatedSprint = response.data;
      dispatch(updateSprintAction(updatedSprint));
      queryClient.setQueryData<Sprint[]>(["sprints", projectId], (old = []) =>
        old.map((sprint) => (sprint.id === updatedSprint.id ? updatedSprint : sprint))
      );
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const deleteSprint = useMutation({
    mutationFn: (sprintId: string) => sprints.delete(projectId, sprintId),
    onSuccess: (_, deletedId) => {
      dispatch(deleteSprintAction(deletedId));
      queryClient.setQueryData<Sprint[]>(["sprints", projectId], (old = []) =>
        old.filter((sprint) => sprint.id !== deletedId)
      );
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  return {
    sprints: sprintsList?.data || [],
    pagination: sprintsList?.pagination,
    isLoading,
    error,
    createSprint,
    updateSprint,
    deleteSprint,
  };
}

export function useSprint(projectId: string, sprintId: string) {
  const dispatch = useDispatch();

  const {
    data: sprint,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprint", projectId, sprintId],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await sprints.getById(projectId, sprintId);
        dispatch(setCurrentSprint(data));
        return data;
      } catch (error) {
        dispatch(setError((error as Error).message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!projectId && !!sprintId,
  });

  return {
    sprint,
    isLoading,
    error,
  };
}
