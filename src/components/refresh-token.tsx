"use client";

import { checkRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Các path không cần check refresh token
const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;

    // const checkRefreshToken = async () => {
    //   /**
    //    * Không nên đưa logic get access token và refresh token ra khỏi hàm 'checkRefreshToken'
    //    * Vì để mỗi lần mà hàm 'checkRefreshToken' chạy, nó sẽ luôn lấy được cái accessToken và refreshToken mới nhất
    //    * Nếu đưa ra ngoài, thì nó chỉ lấy được cái accessToken và refreshToken lúc đầu
    //    */
    //   const accessToken = getAccessTokenFromLocalStorage();
    //   const refreshToken = getRefreshTokenFromLocalStorage();

    //   // Chưa đăng nhập thì cũng kh cho chạy
    //   if (!accessToken || !refreshToken) return;

    //   const decodeAccessToken = jwt.decode(accessToken) as {
    //     exp: number;
    //     iat: number;
    //   };
    //   const decodeRefreshToken = jwt.decode(refreshToken) as {
    //     exp: number;
    //     iat: number;
    //   };

    //   //   Thời điểm hết hạn của token được tính theo epoch time(s)
    //   // Còn khi dùng cú pháp Date().getTime() thì nó trả về epoch time(ms)
    //   const now = Math.round(new Date().getTime() / 1000);

    //   // Nếu refresh token hết hạn thì kh xử lí nữa
    //   if (now >= decodeRefreshToken.exp) return;

    //   //Ví dụ access token có thời gian hết hạn là 10s
    //   // Thì chúng ta sẽ kiểm tra còn 1/3 thời gian hết hạn của access token thì sẽ gửi request refresh token
    //   // Thời gian còn lại sẽ tính theo công thức: decodeAccessToken.exp - now
    //   //  Thời gian hết hạn của accessToken tính theo công thức: decodeAccessToken.exp - decodeAccessToken.iat
    //   if (
    //     decodeAccessToken.exp - now <
    //     (decodeAccessToken.exp - decodeAccessToken.iat) / 3
    //   ) {
    //     // Nếu thời gian còn lại ít hơn 1/3 thời gian hết hạn của access token thì call api refreshToken
    //     try {
    //       const result =
    //         await authApiRequest.refreshTokenFromNextClientToNextServer();
    //       setAccessTokenToLocalStorage(result.payload.data.accessToken);
    //       setRefreshTokenToLocalStorage(result.payload.data.refreshToken);
    //     } catch (error) {
    //       clearInterval(interval);
    //     }
    //   }
    // };

    // Phải gọi lần đâu tiên vì interval chỉ chạy sau thời gian TIMEOUT
    checkRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });

    // TIMEOUT interval phải bé hơn thời gian accessToken hết hạn
    // Ví dụ thời gian hết hạn của access token là 10s thì chúng ta phải cho 1s check 1 lần
    const TIMEOUT = 10000;
    interval = setInterval(checkRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
