import { comments } from "@libs/apis/comment";
import { CreateCommentParams, GetCommentParams } from "@libs/types/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useComments(params: GetCommentParams) {
  const {
    data: commentRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await comments.getAll(params);
      return response.data;
    },
    refetchOnMount: "always",
  });

  return {
    comments: commentRes?.data,
    isLoading,
    error,
  };
}

export function useCreateComment(body: CreateCommentParams) {
  const queryClient = useQueryClient();

  const {
    mutate: createComment,
    mutateAsync: createCommentAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: () => comments.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: () => {
      toast.error("Failed to create comment");
    },
  });

  return {
    createComment,
    createCommentAsync,
    isLoading,
    isSuccess,
    error,
  };
}
