import { projectMembers } from "@libs/apis/projectMember";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { AddProjectMemberParams } from "@libs/apis/projectMember";
import { toast } from "react-toastify";

export function useProjectMembers(projectId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => projectMembers.list(projectId),
    enabled: !!projectId,
  });
  return {
    projectMembers: data?.data.data,
    pagination: data?.data.pagination,
    isLoading,
    error,
  };
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();
  const {
    mutate: addProjectMember,
    mutateAsync: addProjectMemberAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: AddProjectMemberParams) =>{
      console.log(data);
      return projectMembers.add(projectId, data);
    },
    onSuccess: () => {
      toast.success("Project member added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add project member");
    },
  });

  return { addProjectMember, addProjectMemberAsync, isLoading, isSuccess, error };
}
