import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const next = url.searchParams.get("next") || "/dashboard";

  // Lightweight marker cookie for authorization middleware
  const res = NextResponse.json({ success: true });
  res.cookies.set("appwrite-session", "oauth", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });
  // Let client handle the redirect for clarity
  res.headers.set("X-Next-Redirect", next);
  return res;
}
