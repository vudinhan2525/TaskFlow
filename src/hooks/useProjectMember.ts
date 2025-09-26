import { projectMembers } from "@libs/apis/projectMember";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddProjectMemberParams,
  ListProjectMemberParams,
} from "@libs/types/projectMember";
import { toast } from "react-toastify";
import { useAuthStore } from "@libs/store/useAuthStore";

export function useProjectMembers(params: ListProjectMemberParams) {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectMembers", params.project_id, params.name, params.email],
    queryFn: async () => {
      const res = await projectMembers.list(params);
      // put each user into the user cache
      res.data.data.forEach((u) => {
        queryClient.setQueryData(["user", u.id], u);
        if (user?.id === u.user_id) {
          queryClient.setQueryData(["currentUser"], {
            ...user,
            projectRole: u.role,
          });
          setUser({
            ...user,
            projectRole: u.role,
          });
        }
      });

      return res;
    },
    enabled: !!params.project_id,
  });
  return {
    projectMembers: data?.data.data,
    pagination: data?.data.pagination,
    isLoading,
    error,
  };
}
export function useUserMemberships(userId: string) {
  const {
    data: membershipsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-memberships", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      return projectMembers.getUserMemberships(userId);
    },
    enabled: !!userId,
  });

  return {
    memberships: membershipsData?.data.data || [],
    pagination: membershipsData?.data.pagination,
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
    mutationFn: (data: AddProjectMemberParams) => {
      return projectMembers.add(data);
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

  return {
    addProjectMember,
    addProjectMemberAsync,
    isLoading,
    isSuccess,
    error,
  };
}
