import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
  loginFromNextServerToBeServer: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),
  loginFromNextClientToNextServer: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;
