import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { auth } from "../lib/api";
import { setUser, setError } from "../store/slices/authSlice";
import { queryClient } from "../lib/react-query";

export function useAuth() {
  const dispatch = useDispatch();

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await auth.getCurrentUser();
      dispatch(setUser(data));
      return data;
    },
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });

  const login = useMutation({
    mutationFn: auth.login,
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.token);
      dispatch(setUser(data.user));
      queryClient.setQueryData(["currentUser"], data.user);
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const register = useMutation({
    mutationFn: auth.register,
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.token);
      dispatch(setUser(data.user));
      queryClient.setQueryData(["currentUser"], data.user);
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    queryClient.clear();
  };

  return {
    user: currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
