import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { init, environment } from "@/services/edge-setup"; // This would be mocked version. Is it a copy?

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const portfolio_service_locator = init();

  const { pathname } = request.nextUrl;
  const session_cookie = request.cookies.get("session");
  const unauthenticated =
    session_cookie == undefined ||
    !(await portfolio_service_locator.token.validate(session_cookie.value));

  if (pathname.startsWith("/api") && environment == "production") {
    return NextResponse.json({}, { status: 501 });
  }

  if (pathname.startsWith("/api") && unauthenticated) {
    return NextResponse.json({}, { status: 401 });
  }

  if (pathname.startsWith("/admin") && unauthenticated) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}
