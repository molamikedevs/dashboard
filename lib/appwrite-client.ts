import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

// Function to initiate Google OAuth2 login
export const loginWithGoogle = () =>
  account.createOAuth2Session({
    provider: OAuthProvider.Google,
    success: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/success`,
    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    scopes: ["email", "profile"],
  });


// Function to check if the user is logged in
export const checkUserLoggedIn = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Error checking user login status:", error);
    return null;
  }
};