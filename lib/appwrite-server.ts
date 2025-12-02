import { Client, Account, Databases, Storage, Users } from "node-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,

  collections: {
    revenueId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REVENUE_ID!,
    customersId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CUSTOMERS_ID!,
    invoicesId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_INVOICES_ID!,
  },
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
export const users = new Users(client);
