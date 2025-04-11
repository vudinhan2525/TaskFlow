import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { Project } from "../types";
import { projects } from "@libs/apis/project";
import { RootState } from "@libs/store";
import { toast } from "react-toastify";

export function useUserProjects() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProjects", userId],
    queryFn: async () => {
      // TODO : TOAST DONT THROW
      if (!userId) throw new Error("User ID is required");

      const response = await projects.getUserProjects(userId);
      const data = response.data;
      return data;
    },
    enabled: isAuthenticated && !!userId,
  });

  return {
    projects: projectsData?.data || [],
    pagination: projectsData?.pagination,
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

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => projects.update(id, data),
    onSuccess: () => {},
    onError: () => {},
  });

  const deleteProject = useMutation({
    mutationFn: projects.delete,
    onSuccess: () => {},
    onError: () => {},
  });

  return {
    projects: projectsList,
    isLoading,
    error,
    updateProject,
    deleteProject,
  };
}
export function useCreateProject() {
  const {
    mutate: createProject,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: projects.create,
    onSuccess: () => {
      toast.success("You must be logged in to create a project");
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
