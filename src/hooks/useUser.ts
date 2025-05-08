import { useQuery } from "@tanstack/react-query";
import { users } from "@libs/apis/user";

export function useUser(userId: string) {
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

