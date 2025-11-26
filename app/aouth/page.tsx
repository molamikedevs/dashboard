import { account } from "@/lib/appwrite-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {

  await searchParams; 
  
  try {
    // Get the current session after OAuth redirect
    const session = await account.getSession("current");
    
    if (session) {
      // Set the session cookie
      const cookieStore = await cookies();
      cookieStore.set("appwrite-session", session.secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // Redirect to dashboard
      redirect("/dashboard");
    }
  } catch (error) {
    console.error("OAuth callback error:", error);
    // Redirect to login with error
    redirect("/login?error=oauth_failed");
  }

  // Fallback redirect
  redirect("/login");
}