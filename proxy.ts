import { NextRequest, NextResponse } from "next/server";
import { AUTH, detectBrowserSession } from "./lib/auth/config";

// Protect dashboard routes; allow auth pages and static assets
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths that do not require auth
  const publicPaths = AUTH.publicPaths;

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isDashboard = pathname.startsWith("/dashboard");

  if (!isDashboard || isPublic) {
    return NextResponse.next();
  }

  // Check for server-set Appwrite session cookie OR Appwrite OAuth browser session cookie
  const hasServerSession = req.cookies.has(AUTH.serverCookie);
  // Iterate cookies safely
  const rawCookie = req.headers.get("cookie") || "";
  const hasAppwriteBrowserSession = detectBrowserSession(rawCookie, req.cookies.getAll());

  if (!hasServerSession && !hasAppwriteBrowserSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-up";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
