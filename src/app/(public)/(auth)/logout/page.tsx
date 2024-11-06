"use client";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useMutationLogout } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useMutationLogout();
  const router = useRouter();
  const { setIsAuth } = useAppContext();

  // Tạo 1 biến sử dụng useRef() để có thể can thiệp cho trường hợp api logout gọi 2 lần.
  const ref = useRef<any>(null);

  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  useEffect(() => {
    if (
      // Phòng case api logout gọi 2 lần
      !ref.current &&
      //   Phòng trường hợp người dùng thay đổi refreshToken từ url
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        //   Phòng trường hợp người dùng thay đổi accessToken từ url
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setIsAuth(false);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);

  return <div>Logout ....</div>;
}
