import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { Project } from "../types";
import { projects } from "@libs/apis/project";
import { useUserMemberships } from "@libs/hooks/useProjectMember";
import { RootState } from "@libs/store";
import { toast } from "react-toastify";
import {
  CreateColumnProjectParams,
  IColumn,
  UpdateColumnOrderParams,
  UpdateColumnProjectParams,
} from "@libs/types/project";
import { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";

export function useUserProjects() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const userId = user?.id;

  const { memberships, isLoading, error } = useUserMemberships(userId || "");

  // Filter out pending memberships and map to project info
  const validMemberships = memberships.filter(
    (membership) => !membership.is_pending,
  );
  const projects = validMemberships.map((membership) => membership.project);

  return {
    projects: isAuthenticated ? projects : [],
    isLoading,
    error,
  };
}

export function useProjects() {
  const {
    data: projectsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await projects.getAll();
      return data;
    },
  });

  return {
    projects: projectsList,
    isLoading,
    error,
  };
}
export function useCreateProject({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    mutate: createProject,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: projects.create,
    onSuccess: () => {
      toast.success("Create project successfully!!");
      queryClient.invalidateQueries({
        queryKey: ["userProjects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-memberships"],
      });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Some thing went wrong");
    },
  });

  return {
    createProject,
    isLoading,
    isSuccess,
    error,
  };
}
export function useUpdateProject({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    mutate: updateProject,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projects.update(id, data),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["user-memberships"] });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to update project.");
    },
  });

  return {
    updateProject,
    isLoading,
    isSuccess,
    error,
  };
}
export function useDeleteProject({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteProject,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (id: string) => projects.delete(id),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["user-memberships"] });
      if (onClose) onClose();
    },
    onError: () => {
      toast.error("Failed to delete project.");
    },
  });

  return {
    deleteProject,
    isLoading,
    isSuccess,
    error,
  };
}
export function useProject(projectId: string) {
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await projects.getById(projectId);
      return data;
    },
    enabled: !!projectId,
  });

  return {
    project,
    isLoading,
    error,
  };
}

export function useProjectColumns(projectId: string | undefined) {
  const {
    data: columnsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projectColumns", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await projects.getColumns(projectId);
      return response.data;
    },
    enabled: !!projectId,
    refetchOnMount: "always",
  });

  return {
    columns: columnsData?.data || [],
    isLoading,
    error,
  };
}
export function useAddProjectColumn({
  setColumns,
}: {
  setColumns: Dispatch<SetStateAction<IColumn[]>>;
}) {
  const queryClient = useQueryClient();
  const {
    mutate: createColumn,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (body: CreateColumnProjectParams) => projects.addColumns(body),
    onSuccess: (res) => {
      if (res.data.status === "success") {
        setColumns((prev) => [...prev, res.data.data]);
      }
      queryClient.invalidateQueries({ queryKey: ["projectColumns"] });
      toast.success("Stage added successfully!");
    },
    onError: () => {
      toast.error("Failed to delete project.");
    },
  });

  return {
    createColumn,
    isLoading,
    isSuccess,
    error,
  };
}

export function useUpdateProjectOrderColumn() {
  const {
    mutate: updateOrderColumn,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (body: UpdateColumnOrderParams) =>
      projects.updateOrderColumns(body),
    onSuccess: () => {
      toast.success("Column order updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update column order.");
    },
  });

  return {
    updateOrderColumn,
    isLoading,
    isSuccess,
    error,
  };
}

export function useUpdateColumn() {
  const {
    mutate: updateColumn,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (body: UpdateColumnProjectParams) =>
      projects.updateColumns(body),
    onSuccess: () => {
      toast.success("Column updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update column.");
    },
  });

  return {
    updateColumn,
    isLoading,
    isSuccess,
    error,
  };
}
export function useDeleteColumn(
  onDeleteSuccess?: (deletedColumnId: string) => void,
) {
  const {
    mutate: deleteColumn,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (body: { column_id: string }) => projects.deleteColumn(body),
    onSuccess: (_data, variables) => {
      toast.success("Column deleted successfully!");
      if (onDeleteSuccess) {
        onDeleteSuccess(variables.column_id);
      }
    },
    onError: (error: AxiosError) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error?.response?.data as any).message) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((error?.response?.data as any).message);
        return;
      }
      toast.error("Failed to delete column.");
    },
  });

  return {
    deleteColumn,
    isLoading,
    isSuccess,
    error,
  };
}
