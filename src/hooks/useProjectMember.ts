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
