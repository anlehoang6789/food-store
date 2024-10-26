import { NextResponse, type NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // chỉ chơi với server component nên ta check trạng thái đăng nhập bằng cookie
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Chưa đăng nhập thì kh cho vào private path -> chưa đăng nhập thì kh có refreshToken
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đã đăng nhập thì không cho vào trang login
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu đang ở trong private path mà không có accessToken(hết hạn accessToken) thì chuyển hướng về trang logout
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set("refreshToken", refreshToken);

    return NextResponse.redirect(url);
  }

  // Nếu không phải trường hợp trên thì cho qua (diễn ra tự nhiên đó)
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
