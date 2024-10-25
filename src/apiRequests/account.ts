import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  meProfile: () => http.get<AccountResType>("/accounts/me"),
  updateMeProfile: (data: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", data),
  changePassword: (data: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", data),
  changePasswordV2FromNextServerToBEServer: (
    accessToken: string,
    body: ChangePasswordV2BodyType
  ) =>
    http.put<ChangePasswordV2ResType>("accounts/change-password-v2", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  changePasswordV2FromNextClientToNextServer: (
    body: ChangePasswordV2BodyType
  ) =>
    http.put<ChangePasswordV2ResType>(
      "/api/accounts/change-password-v2",
      body,
      {
        baseUrl: "",
      }
    ),
};

export default accountApiRequest;
