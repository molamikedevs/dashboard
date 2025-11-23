import Image from "next/image";
import { Button } from "./button";

const SocialAuth = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className="w-full justify-center bg-gray-800 hover:bg-gray-800">
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
