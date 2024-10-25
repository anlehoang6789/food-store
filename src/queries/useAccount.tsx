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

//Version 1 của change password khi response BE trả về kh có accessToken và refreshToken
// => chưa giải quyết đc case là nhiều thg dùng cùng 1 tài khoản. 1 thg đổi nhưng thg bên kia vẫn xài được bth.
export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};

// Version 2 của change password khi response BE trả về có accessToken và refreshToken
// => giải quyết đc case nhiều thg dùng cùng 1 tài khoản. 1 thg đổi thì thg bên kia phải đăng nhập lại.
export const useUpdatePasswordV2Mutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2FromNextClientToNextServer,
  });
};
