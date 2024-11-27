import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { init } from "@/services/edge-setup";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const portfolio_service_locator = init();

  const { pathname } = request.nextUrl;
  const session_cookie = request.cookies.get("session");

  if (
    pathname.startsWith("/admin") &&
    (session_cookie == undefined ||
      !(await portfolio_service_locator.token.validate(session_cookie.value)))
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}
