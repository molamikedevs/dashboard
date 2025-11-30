export const AUTH = {
  serverCookie: "appwrite-session",
  browserCookiePrefixes: ["a_session_", "a_session_legacy_"],
  browserCookieSubstring: "a_session",
  publicPaths: ["/login", "/sign-up", "/api", "/"],
  defaultDashboard: "/dashboard",
};

export function detectBrowserSession(rawCookieHeader: string, allCookies: { name: string }[]) {
  for (const c of allCookies) {
    const name = c.name;
    if (AUTH.browserCookiePrefixes.some((p) => name.startsWith(p)) || name.includes(AUTH.browserCookieSubstring)) {
      return true;
    }
  }
  if (rawCookieHeader.includes(AUTH.browserCookieSubstring)) return true;
  return false;
}