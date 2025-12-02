"use server";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { account, users } from "../appwrite-server";
import { LoginSchema, SignUpSchema } from "../validation";
import { Query } from "appwrite";

export async function login(formData: FormData) {
  // 1. Validation (Keep your existing schema logic)
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Create Session
    const session = await account.createEmailPasswordSession(email, password);

    // 3. Set the Cookie manually
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (err) {
    console.log("Login error:", err);
    return { error: "Invalid email or password" };
  }
}

export async function signup(formData: FormData) {
  // 1. Validation (Keep your existing schema logic)
  const validatedFields = SignUpSchema.safeParse({
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { username, email, password } = validatedFields.data;

  // 2. Check: Is Username Taken?
  const existingUsernames = await users.list([Query.equal("name", username)]);

  if (existingUsernames.total > 0) {
    return { error: "This username is already taken" };
  }

  // 3. Check: Is Email Taken?
  // Although create() catches this, checking manually lets us return a specific error
  const existingEmails = await users.list([Query.equal("email", email)]);

  if (existingEmails.total > 0) {
    return { error: "This email is already registered" };
  }

  try {
    // 4. Create the Account
    await account.create(ID.unique(), email, password, username);

    // 5. IMMEDIATELY Log the user in (Create Session)
    const session = await account.createEmailPasswordSession(email, password);

    // 6. Set the Cookie manually
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (err) {
    console.log("Signup Error:", err);
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