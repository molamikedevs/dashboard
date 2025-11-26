"use client";

import Image from "next/image";
import { Button } from "./button";
import { oauthLogin } from "@/lib/actions/action.auth";
import { useSearchParams } from "next/navigation";

const SocialAuth = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    await oauthLogin("google");
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      {error === "oauth_failed" && (
        <div className="w-full text-center text-red-500 text-sm mb-2">
          Google authentication failed. Please try again.
        </div>
      )}
      <Button
        className="w-full justify-center bg-gray-800 hover:bg-gray-800"
        onClick={handleGoogleLogin}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuth;
