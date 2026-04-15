import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin/dashboard")) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get("admin_session")?.value;

  if (adminSession === "authenticated") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};