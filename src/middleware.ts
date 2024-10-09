import { NextResponse, type NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // chỉ chơi với server component nên ta check trạng thái đăng nhập bằng cookie
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);

  // Chưa đăng nhập thì kh cho vào private path
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đã đăng nhập thì không cho vào trang login
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu không phải trường hợp trên thì cho qua (diễn ra tự nhiên đó)
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
