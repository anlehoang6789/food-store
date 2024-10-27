import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { message: "Không tìm thấy refreshToken" },
      { status: 401 }
    );
  }

  try {
    // response lấy về sau khi call api login của BE server
    const { payload } =
      await authApiRequest.refreshTokenFromNextServerToBeServer({
        refreshToken,
      });
    //decode access token and refresh token to get the expired time
    const decodeAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };

    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Đã có lỗi xảy ra" },
      { status: 401 }
    );
  }
}
