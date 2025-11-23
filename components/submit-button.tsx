import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { ArrowRightIcon } from "lucide-react";

export default function SubmitButton({ mode }: { mode: "login" | "signup" }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      className="w-full py-2.5 text-sm" 
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
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