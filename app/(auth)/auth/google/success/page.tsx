"use client";

import { useEffect, useState } from "react";
import { checkUserLoggedIn } from "@/lib/appwrite-client";
import { AUTH } from "@/lib/auth/config";
import Link from "next/link";

export default function GoogleSuccess() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Verifying session...");

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        const user = await checkUserLoggedIn();
        if (!user) throw new Error("No user returned");
        // Determine redirect target from ?next= param or default dashboard
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || AUTH.defaultDashboard;
        // Call server to set httpOnly cookie
        const res = await fetch(`/api/auth/session?next=${encodeURIComponent(next)}`, { method: "GET" });
        if (!res.ok) throw new Error("Failed to set server session");
        if (!cancelled) {
          setStatus("ok");
          setMessage("Session verified. Redirecting...");
        }
        // Allow a short delay then navigate (server will redirect if endpoint handles it)
        setTimeout(() => {
          window.location.replace(next);
        }, 300);
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) {
          setStatus("error");
          setMessage("Could not verify Google login. Please try again.");
        }
      }
    }
    verify();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Google Sign-In</h1>
      <p className="text-sm text-gray-600">{message}</p>
      {status === "error" && (
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-500"
          >
            Back to Login
          </Link>
        </div>
      )}
    </main>
  );
}
