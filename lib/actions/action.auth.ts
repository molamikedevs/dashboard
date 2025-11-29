"use server";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { account } from "../appwrite-server";
import { LoginSchema, SignUpSchema } from "../validation";

export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    const session = await account.createEmailPasswordSession(email, password);

    // Store JWT in cookies for SSR
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.log("Login error:", err);
    return { error: "Invalid email or password" };
  }
}

export async function signup(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { username, email, password } = validatedFields.data;
  try {
    await account.create(ID.unique(), email, password, username);
    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Could not create account" };
  }
}

export async function getCurrentUser() {
  const cookie = await cookies();
  const session = cookie.get("appwrite-session")?.value;

  if (!session) return null;

  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } catch {}

  (await cookies()).delete("appwrite-session");
  return true;
}