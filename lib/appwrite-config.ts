import { Client, Account, Databases, Storage } from "node-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  projectId: process.env.APPWRITE_PROJECT_ID!,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
};

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(appwriteConfig.projectId)
  .setKey(process.env.APPWRITE_API_KEY!);


// Initialize Appwrite services
export const account = new Account(client);
export const storage = new Storage(client);
export const database = new Databases(client);
