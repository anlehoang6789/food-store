import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  loginFromNextServerToBeServer: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),
  loginFromNextClientToNextServer: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToBeServer: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: () =>
    http.post("api/auth/logout", null, {
      baseUrl: "",
    }),
};

export default authApiRequest;
