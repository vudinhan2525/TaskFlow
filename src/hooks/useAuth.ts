import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../store/slices/authSlice";
import { queryClient } from "../apis/react-query";
import { auth } from "@libs/apis/auth";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      dispatch(setUser(data.data));
      queryClient.setQueryData(["currentUser"], data.data);
      navigate("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      dispatch(setError(error.response.data.message));
    },
  });

  const register = useMutation({
    mutationFn: auth.register,
    onSuccess: ({ data }) => {
      dispatch(setUser(data.data));
      queryClient.setQueryData(["currentUser"], data.data);
      navigate("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      dispatch(setError(error.response.data.message));
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
