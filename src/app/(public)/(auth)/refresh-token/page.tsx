"use client";
import {
  checkRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");

  useEffect(() => {
    if (
      //   Phòng trường hợp người dùng thay đổi refreshToken từ url
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkRefreshToken({
        onSuccess: () => {
          // Nếu thành công thì redirect về trang theo pathname mà lần cuối ng dùng truy cập hoặc về trang home
          router.push(redirectPathname || "/");
        },
      });
    } else {
      // nếu mà nó check cái refreshToken từ url không khớp với cái được lưu thì nó chuyển về trang Home
      router.push("/");
    }
  }, [router, refreshTokenFromUrl, redirectPathname]);

  return <div>Checking refreshToken ....</div>;
}
