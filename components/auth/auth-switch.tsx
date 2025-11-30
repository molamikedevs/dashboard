import Link from "next/link";

export default function AuthSwitch({ mode }: { mode: "login" | "signup" }) {
  return (
    <>
      {mode === "login" ? (
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="sign-up"
            aria-label="Sign up for a new account"
            className="paragraph-semibold primary-text-gradient text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="login"
            aria-label="Log in to your account"
            className="paragraph-semibold primary-text-gradient text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      )}
    </>
  );
}
