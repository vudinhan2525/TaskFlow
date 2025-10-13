import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sprints } from "../../apis/sprint";
import { toast } from "react-toastify";
import { ISprint } from "@libs/types/sprint";

export function useProjectSprints(projectId: string, enabled?: boolean) {
  const {
    data: sprintsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprints", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const { data } = await sprints.list(projectId);
      return data;
    },
    enabled: !!projectId && (enabled === undefined ? true : enabled),
  });
  return {
    sprints: sprintsData?.data || [],
    pagination: sprintsData?.pagination,
    isLoading,
    error,
  };
}

export function useSprint(projectId: string, sprintId: string) {
  const {
    data: sprint,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprint", projectId, sprintId],
    queryFn: async () => {
      const { data } = await sprints.getById(projectId, sprintId);
      return data;
    },
    enabled: !!projectId && !!sprintId,
  });

  return {
    sprint,
    isLoading,
    error,
  };
}

export function useCreateSprint({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: createSprint,
    mutateAsync: createSprintAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: Omit<ISprint, "id" | "created_at" | "updated_at">) =>
      sprints.create(projectId, data),
    onSuccess: () => {
      toast.success("Sprint created successfully!");
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to create sprint");
    },
  });

  return {
    createSprint,
    createSprintAsync: createSprintAsync,
    isLoading,
    isSuccess,
    error,
  };
}

export function useUpdateSprint({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: updateSprint,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ISprint> }) =>
      sprints.update(projectId, id, data),
    onSuccess: (_, variables) => {
      toast.success("Sprint updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["sprint", projectId, variables.id],
      });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to update sprint");
    },
  });

  return {
    updateSprint,
    isLoading,
    isSuccess,
    error,
  };
}

export function useDeleteSprint({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteSprint,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (id: string) => sprints.delete(id),
    onSuccess: () => {
      toast.success("Sprint deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to delete sprint");
    },
  });

  return {
    deleteSprint,
    isLoading,
    isSuccess,
    error,
  };
}
