"use client";


import { useActionState, useState } from "react";
import { AtSign, CircleUser, Eye, EyeOff, Lock } from "lucide-react";
import { login, signup } from "@/lib/actions/action.auth";
import AuthSwitch from "./auth-switch";
import SocialAuth from "./social-auth";
import SubmitButton from "./submit-button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const action = mode === "login" ? login : signup;
  
  // ErrorType state
  const initialState = {
    success: false,
    errors: null,
    values: null
  };
  
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-custom-muted text-custom-foreground px-4 sm:px-6 pb-6 pt-8 w-full max-w-md mx-auto">
        <h1
          className={`mb-4 text-xl sm:text-2xl text-background font-serif text-center`}>
          {mode === "login"
            ? "Please log in to continue."
            : "Please sign up to continue."}
        </h1>

        {/* General Error Message */}
        {state?.errors?.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {state.errors.general}
          </div>
        )}

        {mode === "signup" ? (
          <div className="w-full space-y-4">
            <div>
              <label
                className="mb-2 block text-xs font-medium text-gray-900"
                htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-muted py-2.5 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  aria-describedby="username-error"
                  defaultValue={state?.values?.username || ""}
                />
                <CircleUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {state?.errors?.username && (
                <p id="username-error" className="text-red-500 text-xs mt-1">
                  {state.errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-custom-muted py-2.5 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  aria-describedby="email-error"
                  defaultValue={state?.values?.email || ""}
                />
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {state?.errors?.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-medium"
                htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  minLength={6}
                  aria-describedby="password-error"
                  defaultValue={state?.values?.password || ""}
                />
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                {isVisible ? (
                  <EyeOff
                    onClick={() => setIsVisible(false)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                ) : (
                  <Eye
                    onClick={() => setIsVisible(true)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                )}
              </div>
              {state?.errors?.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {state.errors.password}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  aria-describedby="email-error"
                  defaultValue={state?.values?.email || ""}
                />
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {state?.errors?.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-medium"
                htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-custom-muted py-2.5 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  minLength={6}
                  aria-describedby="password-error"
                  defaultValue={state?.values?.password || ""}
                />
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                {isVisible ? (
                  <EyeOff
                    onClick={() => setIsVisible(false)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                ) : (
                  <Eye
                    onClick={() => setIsVisible(true)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                )}
              </div>
              {state?.errors?.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {state.errors.password}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <SubmitButton mode={mode} />
          <div className="mt-4">
            <SocialAuth />
          </div>
          <div className="mt-4">
            <AuthSwitch mode={mode} />
          </div>
        </div>
      </div>
    </form>
  );
}