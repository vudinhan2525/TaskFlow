import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { sprints, Sprint } from "@libs/apis/sprint";
import { toast } from "react-toastify";
import { ResponseApi } from "@libs/apis/api";

export function useSprint(projectId: string) {
  const queryClient = useQueryClient();

  const {
    data: sprintList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprints", projectId],
    queryFn: () => sprints.list(projectId),
    enabled: !!projectId,
  });

  const createSprint = useMutation({
    mutationFn: (data: Omit<Sprint, "id" | "created_at" | "updated_at">) =>
      sprints.create(projectId, { ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      toast.success("Sprint created successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to create sprint");
    },
  });

  const updateSprint = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sprint> }) => sprints.update(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      toast.success("Sprint updated successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to update sprint");
    },
  });

  const deleteSprint = useMutation({
    mutationFn: (id: string) => sprints.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      toast.success("Sprint deleted successfully");
    },
    onError: (error: AxiosError<ResponseApi<null>>) => {
      toast.error(error.response?.data?.message || "Failed to delete sprint");
    },
  });

  return {
    sprints: sprintList?.data?.data || [],
    pagination: sprintList?.data?.pagination,
    isLoading,
    error,
    createSprint,
    updateSprint,
    deleteSprint,
  };
}
