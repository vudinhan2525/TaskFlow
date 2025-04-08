import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setCurrentProject, setLoading, setError } from "../store/slices/projectSlice";
import { queryClient } from "../apis/react-query";
import type { Project } from "../types";
import { projects } from "@libs/apis/project";
import { RootState } from "@libs/store";

export function useUserProjects() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProjects", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      dispatch(setLoading(true));
      try {
        const response = await projects.getUserProjects(userId);
        const data = response.data;
        return data;
      } catch (error) {
        console.error("Error fetching user projects:", error);
        dispatch(setError((error as Error).message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: isAuthenticated && !!userId,
  });

  console.log("User projects data:", projectsData); // Debug log

  return {
    projects: projectsData?.data || [],
    pagination: projectsData?.pagination,
    isLoading,
    error,
  };
}

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
        console.log("Project data:", data);
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
