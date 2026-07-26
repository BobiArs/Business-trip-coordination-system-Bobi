import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../shared/api/axiosInstance";
import type { User } from "../../../entities/trip/model/types";
import { useAuth } from "../../../entities/user/model/store";

export const useAuthMe = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["auth-me", accessToken],
    queryFn: async () => {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    },
    enabled: !!accessToken,
  });
};
