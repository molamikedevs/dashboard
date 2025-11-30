import { Button } from "../common/button";
import { ArrowRightIcon } from "lucide-react";

export default function SubmitButton({
  mode,
  isLoading = false,
}: {
  mode: "login" | "signup";
  isLoading?: boolean;
}) {
  return (
    <Button
      className="w-full py-2.5 text-sm"
      type="submit"
      disabled={isLoading}
      aria-disabled={isLoading}>
      {isLoading ? (
        "Processing..."
      ) : (
        <>
          {mode === "login" ? "Log in" : "Sign up"}{" "}
          <ArrowRightIcon className="ml-auto h-4 w-4 text-gray-50" />
        </>
      )}
    </Button>
  );
}
