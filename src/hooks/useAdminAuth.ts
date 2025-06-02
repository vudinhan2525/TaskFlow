import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { queryClient } from "../apis/react-query";
import { auth } from "@libs/apis/auth";
import { useNavigate } from "react-router-dom";

export function useAdminAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: auth.login,
    onSuccess: ({ data }) => {
      if (data.data.role === "Admin") {
        dispatch(setUser(data.data));
        queryClient.setQueryData(["currentUser"], data.data);
        navigate("/admin/dashboard");
      } else {
        throw new Error("Unauthorized: Admin access only");
      }
    },
  });

  return {
    login,
  };
}
