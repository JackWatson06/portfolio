import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { init, environment } from "@/services/edge-setup";

function stripTrailingSlash(url: string) {
  if (url.length == 0 || url[url.length - 1] != "/") {
    return url;
  }

  return url.slice(undefined, url.length - 1);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const portfolio_service_locator = init();

  const { pathname } = request.nextUrl;
  const pathname_stripped = stripTrailingSlash(pathname);
  const session_cookie = request.cookies.get("session");
  const unauthenticated =
    session_cookie == undefined ||
    !(await portfolio_service_locator.token.validate(session_cookie.value));

  if (pathname_stripped.startsWith("/api") && environment == "production") {
    return NextResponse.json({}, { status: 501 });
  }

  if (
    pathname_stripped.startsWith("/api") &&
    !pathname_stripped.startsWith("/api/media/") &&
    unauthenticated
  ) {
    return NextResponse.json({}, { status: 401 });
  }

  if (pathname_stripped.startsWith("/admin") && unauthenticated) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}
