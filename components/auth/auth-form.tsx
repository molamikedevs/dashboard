"use client";

import { useState } from "react";
import { AtSign, CircleUser, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthSwitch from "./auth-switch";
import SubmitButton from "./submit-button";
import SocialAuth from "./social-auth";
import useFormValidation from "@/hooks/use-form-validation";
import ErrorInput from "../common/error-input";
import { login, signup } from "@/lib/actions/action.auth";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const router = useRouter();
  // Initial values with all possible fields
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  // Validation rules that always include all fields
  const validationRules = {
    username:
      mode === "signup"
        ? {
            required: true,
            minLength: 3,
            pattern: /^[a-zA-Z0-9_]+$/,
          }
        : {
            // For login, don't validate username (it won't be shown or used)
            required: false,
          },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  };

  const {
    values,
    errors,
    handleChange,
    validate,
    isSubmitting,
    setIsSubmitting,
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let result;

      // Build FormData
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (mode === "signup") {
        formData.append("username", values.username);
        result = await signup(formData);
      } else {
        result = await login(formData);
      }

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setServerError(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setServerError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInputClass =
    "peer block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500";
  const errorInputClass = "border-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-custom-muted text-custom-foreground px-4 sm:px-6 pb-6 pt-8 w-full max-w-md mx-auto">
        <h1 className="mb-4 text-xl sm:text-2xl text-background font-serif text-center">
          {mode === "login"
            ? "Please log in to continue."
            : "Please sign up to continue."}
        </h1>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-4 p-3 bg-custom-muted border border-red-200 text-red-400 rounded text-sm text-center">
            {serverError}
          </div>
        )}

        {mode === "signup" && (
          <div className="mb-4">
            <label
              className="mb-2 block text-xs font-medium"
              htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                className={`${commonInputClass} ${
                  errors.username ? errorInputClass : ""
                }`}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <CircleUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <ErrorInput message={errors.username} />
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              className={`${commonInputClass} ${
                errors.email ? errorInputClass : ""
              }`}
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <ErrorInput message={errors.email} />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className={`${commonInputClass} ${
                errors.password ? errorInputClass : ""
              }`}
              id="password"
              type={isVisible ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}>
              {isVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <ErrorInput message={errors.password} />
        </div>

        <div className="text-center mt-6">
          <SubmitButton mode={mode} isLoading={isSubmitting} />
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
