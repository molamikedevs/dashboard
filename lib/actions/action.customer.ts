import { Customer } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";

// Helper function to get customers as a map
export async function getCustomersMap() {
    const response = await database.listDocuments(
    appwriteConfig.databaseId,
    "customers"
    );

  // Convert list -> map for fast lookup
    const map = new Map();
    response.documents.forEach((c) => map.set(c.$id, c));
    return map;
}

export async function getCustomers(): Promise<Customer[]> {
    const response = await database.listDocuments(
    appwriteConfig.databaseId,
    "customers"
    );

    return response.documents.map((doc) => ({
    $id: doc.$id,
    name: doc.name,
    email: doc.email,
    image_url: doc.image_url,
    }));
}