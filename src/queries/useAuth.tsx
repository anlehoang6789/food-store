import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useMutationLogin = () => {
  return useMutation({
    mutationFn: authApiRequest.loginFromNextClientToNextServer,
  });
};
