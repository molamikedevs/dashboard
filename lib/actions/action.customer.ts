import { Customer } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";

// =====================================================
// Fetch Customers as Map (for JOIN-like operations)
// =====================================================

export async function getCustomersMap() {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      "customers"
    );
    const map = new Map();
    response.documents.forEach((c) => map.set(c.$id, c));
    return map;
  } catch (error) {
    console.error("Failed to fetch customers map:", error);
    throw new Error("Unable to fetch customers map.");
  }
}

// =====================================================
// Fetch Customers as Array (for UI lists)
// =====================================================

export async function getCustomers(): Promise<Customer[]> {
  try {
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
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw new Error("Unable to fetch customers.");
  }
}