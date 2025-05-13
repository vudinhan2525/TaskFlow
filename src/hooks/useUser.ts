import { useQuery } from "@tanstack/react-query";
import { users } from "@libs/apis/user";

export function useUserById(userId: string) {
 const {
    data:userData,
    isLoading,
    error
 }=useQuery({
    queryKey:["user",userId],
    queryFn:async()=>{
        if(!userId) throw new Error("User ID is required");
        const {data}=await users.getById(userId);
        return data;
    },
    enabled:!!userId
 })
 return {
    user:userData?.data,
    isLoading,
    error
 }
}


export function useListUser(keyword: string) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", keyword],
    queryFn: async () => {
      const { data } = await users.list(keyword);
      return data;
    },
    enabled: keyword.length > 0,
  });
  return {
    users: data?.data,
    isLoading,
    error,
  };
}
