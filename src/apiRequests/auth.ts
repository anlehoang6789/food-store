import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
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
  refreshTokenFromNextServerToBeServer: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("auth/refresh-token", body),
  refreshTokenFromNextClientToNextServer: () =>
    http.post<RefreshTokenResType>("api/auth/refresh-token", null, {
      baseUrl: "",
    }),
};

export default authApiRequest;
