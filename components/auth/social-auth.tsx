"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../common/button";
import { loginWithGoogle } from "@/lib/appwrite-client";
import Image from "next/image";

export default function SocialAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-custom-muted px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-md bg-custom-muted px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Image
            src="/icons/google.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
        )}
        Continue with Google
      </Button>
    </div>
  );
}
