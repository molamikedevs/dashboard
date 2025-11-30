"use server";

import { revalidatePath } from "next/cache";
import { ID } from "appwrite";
import { Customer } from "@/types";
import { appwriteConfig, database, storage } from "../appwrite-server";
import { getInvoices } from "./action.invoice";
import { isAppwriteError, ITEMS_PER_PAGE } from "../utils";
import { CreateCustomerSchema } from "../validation";
import { redirect } from "next/navigation";

// Fetch a map of customer IDs to customer data
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

// Fetch all customers
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

// Fetch a single customer by ID
export async function getCustomerById(id: string) {
  try {
    const doc = await database.getDocument(
      appwriteConfig.databaseId,
      "customers",
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
    console.error("Database Error:", err);
    throw new Error("Unexpected error fetching invoice.");
  }
}

// Fetch customers and augment with invoice statistics
export async function getFormattedCustomersTable() {
  const customers = await getCustomers();
  const invoices = await getInvoices();

  // Create a dictionary of invoice stats grouped by customer_id
  const invoiceStats: Record<
    string,
    { total_invoices: number; total_paid: number; total_pending: number }
  > = {};

  invoices.forEach((inv) => {
    if (!invoiceStats[inv.customer_id]) {
      invoiceStats[inv.customer_id] = {
        total_invoices: 0,
        total_paid: 0,
        total_pending: 0,
      };
    }

    invoiceStats[inv.customer_id].total_invoices += 1;

    if (inv.status === "paid") {
      invoiceStats[inv.customer_id].total_paid += inv.amount;
    } else if (inv.status === "pending") {
      invoiceStats[inv.customer_id].total_pending += inv.amount;
    }
  });

  // Merge customers + invoice stats
  const formatted = customers.map((cust) => {
    const stats = invoiceStats[cust.$id] || {
      total_invoices: 0,
      total_paid: 0,
      total_pending: 0,
    };

    return {
      $id: cust.$id,
      name: cust.name,
      email: cust.email,
      image_url: cust.image_url,
      total_invoices: stats.total_invoices,
      total_paid: stats.total_paid,
      total_pending: stats.total_pending,
    };
  });

  return formatted;
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const customers = await getFormattedCustomersTable();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const q = query.toLowerCase();

  const filtered = customers.filter((customer) => {
    const values = [customer.name ?? "", customer.email ?? ""];
    return values.some((v) => v.toLowerCase().includes(q));
  });

  return filtered.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchCustomersPages(query: string) {
  const customers = await getFormattedCustomersTable();
  const q = query.toLowerCase();

  const filtered = customers.filter((customer) => {
    const values = [customer.name ?? "", customer.email ?? ""];
    return values.some((v) => v.toLowerCase().includes(q));
  });

  return Math.ceil(filtered.length / ITEMS_PER_PAGE);
}

// Upload image to Appwrite Storage and return public view URL
async function uploadImage(file: File): Promise<string | null> {
  try {
    // Directly pass the File object to Appwrite (supported by SDK in Node 18+ / Next.js runtime)
    const result = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    const fileUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.storageId}/files/${result.$id}/view?project=${appwriteConfig.projectId}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("image_url") as File | null;

  // Validate required fields early (image_url optional)
  const parsed = CreateCustomerSchema.safeParse({ name, email, image_url: "" });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  try {
    let imageUrl: string | null = null;
    // Upload only if we truly received a File with size
    if (
      imageFile &&
      typeof imageFile === "object" &&
      "arrayBuffer" in imageFile &&
      (imageFile as File).size > 0
    ) {
      const uploadedUrl = await uploadImage(imageFile as File);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const documentData = {
      name,
      email,
      image_url: imageUrl,
    } as const;

    await database.createDocument(
      appwriteConfig.databaseId,
      "customers",
      ID.unique(),
      documentData
    );

    revalidatePath("/dashboard/customers");
    return { success: true, message: "Customer created successfully!" };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, message: "Failed to create customer" };
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  await database.deleteDocument(appwriteConfig.databaseId, "customers", id);

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const name = formData.get("name")?.toString();

    if (!name?.trim()) {
      return { message: "Customer name is required." };
    }

    // Update only the name field in Appwrite
    await database.updateDocument(appwriteConfig.databaseId, "customers", id, {
      name: name.trim(),
    });
  } catch (err: unknown) {
    console.error("Database Error:", err);
    return { message: "Failed to update customer." };
  }

  // Revalidate the customers path
  revalidatePath("/dashboard/customers");

  // Redirect after successful update
  redirect("/dashboard/customers");
}
