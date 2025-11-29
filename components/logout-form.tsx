
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Power, Loader2 } from "lucide-react";
import { logout } from "@/lib/actions/action.auth";

export default function LogoutForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    setIsLoading(true);

    try {
      const result = await logout();
      if (result) {
        // Adding a slight delay to ensure logout process completes before redirect
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/login");
        router.refresh(); // Refresh to update auth state
      } else {
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogout} className="w-full">
      <button
        type="submit"
        disabled={isLoading}
        className={`flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-custom-muted p-3 text-sm font-medium transition-colors ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-sky-100 hover:text-blue-600"
        } md:flex-none md:justify-start md:p-2 md:px-3`}>
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Power className="w-6" />
        )}
        <div className="hidden md:block">
          {isLoading ? "Signing Out..." : "Sign Out"}
        </div>
      </button>
    </form>
  );
}