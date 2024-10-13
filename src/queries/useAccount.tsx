import accountApiRequest from "@/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMeProfileQuery = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequest.meProfile,
  });
};

export const useUpdateMeProfileMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMeProfile,
  });
};
