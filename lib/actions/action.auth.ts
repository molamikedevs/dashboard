"use server";


import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { account } from "../appwrite-config";
import { ID } from "node-appwrite";
import { LoginSchema, SignUpSchema } from "../validation";
import { ErrorType } from "@/types";


export async function login(prevState: ErrorType, formData: FormData): Promise<ErrorType> {
  const validationData = LoginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validationData.success) {
    const errors: Record<string, string> = {};
    validationData.error.errors.forEach((err) => {
      if (err.path?.[0]) errors[err.path[0]] = err.message;
    });

    return {
      success: false,
      errors,
      values: {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    };
  }

  const { email, password } = validationData.data;

  try {
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days for persistence
    });

    redirect("/dashboard");
    
  } catch (err: Error | unknown) {
    console.error("Login error:", err);
    let errorMessage = "Email or password is incorrect.";
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
      throw err;
    }
    
    if (err instanceof Error && err.message.includes("401")) {
      errorMessage = "Invalid email or password.";
    }

    return {
      success: false,
      errors: { general: errorMessage },
      values: {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    };
  }
}

export async function signup(prevState: ErrorType, formData: FormData): Promise<ErrorType> {
  const validationData = SignUpSchema.safeParse({
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validationData.success) {
    const errors: Record<string, string> = {};
    validationData.error.errors.forEach((err) => {
      if (err.path?.[0]) errors[err.path[0]] = err.message;
    });

    return {
      success: false,
      errors,
      values: {
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    };
  }

  const { username, email, password } = validationData.data;

  try {
    // Create the user account
    await account.create(ID.unique(), email, password, username);
    
    // Log the user in immediately after signup
    const session = await account.createEmailPasswordSession(email, password);
    
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Throw the redirect
    redirect("/dashboard");
    
  } catch (err: Error | unknown) {
    console.error("Signup error:", err);
    
    let errorMessage = "Something went wrong. Try again later.";
    
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
      throw err;
    }
    
    if (err instanceof Error && err.message.includes("409")) {
      errorMessage = "User with this email already exists.";
    }

    return {
      success: false,
      errors: { general: errorMessage },
      values: {
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
    };
  }
}


export async function logout() {
  try {
    await account.deleteSession("current");
  } catch {}

  (await cookies()).delete("appwrite-session");
  return true;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session")?.value;

  if (!session) return null;

  try {
    return await account.get();
  } catch {
    return null;
  }
}
