import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { projects } from "../lib/api";
import { setProjects, setCurrentProject, setLoading, setError } from "../store/slices/projectSlice";
import { queryClient } from "../lib/react-query";
import type { Project } from "../types";

export function useProjects() {
  const dispatch = useDispatch();

  const {
    data: projectsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await projects.getAll();
        dispatch(setProjects(data));
        return data;
      } catch (error) {
        dispatch(setError((error as Error).message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  const createProject = useMutation({
    mutationFn: projects.create,
    onSuccess: (response) => {
      const newProject = response.data;
      queryClient.setQueryData<Project[]>(["projects"], (old = []) => [...old, newProject]);
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => projects.update(id, data),
    onSuccess: (response) => {
      const updatedProject = response.data;
      queryClient.setQueryData<Project[]>(["projects"], (old = []) =>
        old.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      );
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const deleteProject = useMutation({
    mutationFn: projects.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) =>
        old.filter((project) => project.id !== deletedId)
      );
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  return {
    projects: projectsList,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}

export function useProject(projectId: string) {
  const dispatch = useDispatch();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await projects.getById(projectId);
        dispatch(setCurrentProject(data));
        return data;
      } catch (error) {
        dispatch(setError((error as Error).message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!projectId,
  });

  return {
    project,
    isLoading,
    error,
  };
}
