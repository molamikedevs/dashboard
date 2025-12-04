"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "appwrite";
import { Customer } from "@/types";
import { appwriteConfig, database, storage } from "../appwrite-server";

import { isAppwriteError, ITEMS_PER_PAGE } from "../utils";
import { CreateCustomerSchema } from "../validation";
import { redirect } from "next/navigation";

// Get a map of all customers by their ID
export async function getCustomersMap() {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      [Query.limit(1000)] // Assuming we have less than 1000 customers
    );
    const map = new Map();
    response.documents.forEach((c) => map.set(c.$id, c));
    return map;
  } catch (error) {
    console.error("Failed to fetch customers map:", error);
    throw new Error("Unable to fetch customers map.");
  }
}

// Fetch all customers (limited to 50)
export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      [Query.limit(50)]
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

// Fetch a single customer by ID
export async function getCustomerById(id: string) {
  try {
    const doc = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      id
    );
    return {
      $id: doc.$id,
      image_url: doc.image_url,
      name: doc.name,
      email: doc.email,
    };
  } catch (err: unknown) {
    if (isAppwriteError(err) && err.code === 404) return null;
    throw new Error("Unexpected error fetching customer.");
  }
}

// Internal helper
async function uploadImage(file: File): Promise<string | null> {
  try {
    const result = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return `https://fra.cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.storageId}/files/${result.$id}/view?project=${appwriteConfig.projectId}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

// Fetch customers with filtering and pagination
export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let customers = [];

    // --- PATH A: SEARCH MODE ---
    if (query) {
      // If searching, we ask DB to find matches by Name or Email
      const response = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.customersId,
        [
          Query.search("name", query), // Note: Appwrite Search requires a FullText index
          Query.limit(ITEMS_PER_PAGE),
          Query.offset(offset),
        ]
      );
      customers = response.documents;
    }
    // --- PATH B: FAST MODE (No Search) ---
    else {
      // Just get the next page of users
      const response = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.customersId,
        [
          Query.orderDesc("$createdAt"),
          Query.limit(ITEMS_PER_PAGE),
          Query.offset(offset),
        ]
      );
      customers = response.documents;
    }

    // If no customers found, return early
    if (customers.length === 0) return [];

    // --- AGGREGATE STATS (The "Join") ---
    // We need to calculate total_invoices and total_paid for ONLY these 6 customers.

    const customerIds = customers.map((c) => c.$id);

    // Fetch ALL invoices belonging to these specific customers
    // (This is much lighter than fetching ALL invoices in the system)
    const invoiceResponse = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.invoicesId,
      [Query.equal("customer_id", customerIds)]
    );

    const relatedInvoices = invoiceResponse.documents;

    // Map the stats in memory
    const formatted = customers.map((cust) => {
      // Filter invoices for this specific customer
      const customerInvoices = relatedInvoices.filter(
        (inv) => inv.customer_id === cust.$id
      );

      const total_invoices = customerInvoices.length;
      const total_pending = customerInvoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0);
      const total_paid = customerInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        $id: cust.$id,
        name: cust.name,
        email: cust.email,
        image_url: cust.image_url,
        total_invoices,
        total_pending,
        total_paid,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error fetching filtered customers:", error);
    return [];
  }
}

// Fetch total pages for customers based on search query
export async function fetchCustomersPages(query: string) {
  try {
    // Optimization: If no search, just read the metadata 'total'
    if (!query) {
      const response = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.customersId,
        [Query.limit(1)] // Fetch 1 just to get the total count
      );
      return Math.ceil(response.total / ITEMS_PER_PAGE);
    }

    // If searching, we need to count matches
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      [Query.search("name", query)]
    );
    return Math.ceil(response.total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching customer pages:", error);
    return 1;
  }
}

// CRUD OPERATIONS
export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("image_url") as File | null;

  const parsed = CreateCustomerSchema.safeParse({ name, email, image_url: "" });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  try {
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      ID.unique(),
      {
        name,
        email,
        image_url: imageUrl,
      }
    );

    revalidatePath("/dashboard/customers");
    return { success: true, message: "Customer created successfully!" };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, message: "Failed to create customer" };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const name = formData.get("name")?.toString();

    if (!name?.trim()) {
      return { message: "Customer name is required." };
    }

    // Update only the name field in Appwrite
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      id,
      {
        name: name.trim(),
      }
    );
  } catch (err: unknown) {
    console.error("Database Error:", err);
    return { message: "Failed to update customer." };
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      id
    );
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Failed to delete customer:", error);
  }
}






