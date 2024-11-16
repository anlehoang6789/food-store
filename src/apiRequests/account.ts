import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/accounts";
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
    http.put<ChangePasswordV2ResType>("/accounts/change-password-v2", body, {
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

  listEmployees: () => http.get<AccountListResType>(prefix),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(prefix, body),
  employeeDetails: (id: number) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
};

export default accountApiRequest;
