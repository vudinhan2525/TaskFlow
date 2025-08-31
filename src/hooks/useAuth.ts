import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../store/slices/authSlice";
import { queryClient } from "../apis/react-query";
import { auth } from "@libs/apis/auth";
import { users } from "@libs/apis/user";
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
      dispatch(setUser(data.data));
      return data;
    },
    retry: false,
    enabled: true,
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
    onSuccess: (_, variables) => {
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      dispatch(setError(error.response.data.message));
    },
  });

  const verifyOtp = useMutation({
    mutationFn: auth.verify,
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

  const resendOtp = useMutation({
    mutationFn: auth.resend,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      dispatch(setError(error.response.data.message));
    },
  });

  const logout = async () => {
    try {
      await auth.logout(); // Call the server to clear cookies
      localStorage.removeItem("token");
      dispatch(setUser(null));
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const updateUser = useMutation({
    mutationFn: users.update,
    onSuccess: ({ data }) => {
      dispatch(setUser(data.data));
      queryClient.setQueryData(["currentUser"], { data: data.data });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Update failed:", error);
    },
  });

  return {
    user: currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    updateUser: updateUser.mutate,
  };
}
