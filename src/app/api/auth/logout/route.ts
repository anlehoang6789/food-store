//API dùng cho việc logout với server component là xóa access token và refresh token khỏi cookie
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Không nhận được access token hoặc refresh token" },
      { status: 200 }
    );
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToBeServer({
      accessToken,
      refreshToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      { message: "Lỗi khi gọi API đến server be" },
      { status: 200 }
    );
  }
}
