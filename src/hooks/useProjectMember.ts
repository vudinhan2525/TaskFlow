import { projectMembers } from "@libs/apis/projectMember";
import { useQuery } from "@tanstack/react-query";

export function useProjectMembers(projectId: string) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
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
