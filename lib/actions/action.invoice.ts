"use server";

import { Invoice, LatestInvoice } from "@/types";
import { database, appwriteConfig } from "../appwrite-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "../validation";
import { getCustomersMap } from "./action.customer";
import { isAppwriteError, ITEMS_PER_PAGE } from "../utils";
import { Query } from "node-appwrite";

// Fetch all invoices (limited to 50)
export async function getInvoices(): Promise<Invoice[]> {
  const res = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.collections.invoicesId,
    [Query.limit(50)]
  );

  return res.documents.map((doc) => ({
    $id: doc.$id,
    customer_id: doc.customer_id,
    amount: doc.amount,
    status: doc.status,
    date: doc.date,
  }));
}

// Fetch a single invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const doc = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.invoicesId,
      id
    );

    return {
      $id: doc.$id,
      customer_id: doc.customer_id,
      amount: doc.amount,
      status: doc.status,
      date: doc.date,
    };
  } catch (err: unknown) {
    if (isAppwriteError(err) && err.code === 404) return null;

    console.error("Database Error:", err);
    throw new Error("Unexpected error fetching invoice.");
  }
}

// Fetch the 5 most recent invoices with customer details
export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  try {
    // STEP 1: Get ONLY the 5 most recent invoices from the database
    // This is much faster than fetching all of them.
    const invoiceResponse = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.invoicesId,
      [
        Query.orderDesc("date"), // Sort by date (newest first)
        Query.limit(5), // Get only 5
      ]
    );

    const invoices = invoiceResponse.documents;
    if (invoices.length === 0) return [];

    //  Get the unique Customer IDs from those 5 invoices
    // We use a Set to ensure we don't fetch the same customer twice
    const customerIds = [...new Set(invoices.map((inv) => inv.customer_id))];

    // Fetch ONLY the customers that belong to these 5 invoices
    // We use Query.equal with an array to get them all in one request
    const customerResponse = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.customersId,
      [Query.equal("$id", customerIds)]
    );

    const customers = customerResponse.documents;

    //  Create a quick lookup map (Dictionary)
    // This makes matching faster than looping through arrays again
    const customerMap = new Map(customers.map((c) => [c.$id, c]));

    //  Merge the data together
    const mergedData = invoices.map((inv) => {
      const customer = customerMap.get(inv.customer_id);

      return {
        $id: inv.$id,
        amount: inv.amount,
        status: inv.status,
        date: inv.date,
        name: customer?.name || "Unknown Customer",
        email: customer?.email || "No Email",
        image_url: customer?.image_url || "/default-avatar.png",
      };
    });

    return mergedData;
  } catch (error) {
    console.error("Failed to fetch latest invoices:", error);
    return [];
  }
}

// Fetch filtered & paginated invoices
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Part A. No Search Query Mode
    if (!query) {
      // 1. Fetch ONLY the invoices for this specific page (e.g., 6 items)
      const invoiceResponse = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.invoicesId,
        [
          Query.orderDesc("date"),
          Query.limit(ITEMS_PER_PAGE),
          Query.offset(offset), // Skip the previous pages
        ]
      );

      const invoices = invoiceResponse.documents;

      // If page is empty, return early
      if (invoices.length === 0) return [];

      // 2. Get unique customer IDs from ONLY these 6 invoices
      const customerIds = [...new Set(invoices.map((inv) => inv.customer_id))];

      // 3. Fetch ONLY these specific customers
      const customerResponse = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.customersId,
        [Query.equal("$id", customerIds)]
      );

      // 4. Create a mini-map for just these customers
      const customerMap = new Map(
        customerResponse.documents.map((c) => [c.$id, c])
      );

      // 5. Merge and return
      return invoices.map((inv) => {
        const c = customerMap.get(inv.customer_id);
        return {
          id: inv.$id,
          amount: inv.amount,
          date: inv.date,
          status: inv.status,
          name: c?.name ?? "Unknown",
          email: c?.email ?? "No Email",
          image_url: c?.image_url ?? "/placeholder.png",
        };
      });
    }

    // Part B. Search Mode
    // Since we need to search by Client Name (which is in a different collection)
    // OR Amount (which is in this collection), doing this purely in DB
    // is very complex in NoSQL without denormalization.
    // We stick to your original logic here for accuracy.

    const invoices = await getInvoices();
    const customers = await getCustomersMap();
    const q = query.toLowerCase();

    const merged = invoices
      .map((inv) => {
        const c = customers.get(inv.customer_id);
        return {
          id: inv.$id,
          amount: inv.amount,
          date: inv.date,
          status: inv.status,
          name: c?.name ?? "",
          email: c?.email ?? "",
          image_url: c?.image_url ?? "",
        };
      })
      .filter((item) => {
        const values = [
          item.name,
          item.email,
          item.status,
          item.amount.toString(),
          item.date,
        ];
        return values.some((v) => v.toLowerCase().includes(q));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply manual pagination on the filtered results
    return merged.slice(offset, offset + ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Failed to fetch filtered invoices:", error);
    return [];
  }
}

// Fetch total pages for invoices based on search query
export async function fetchInvoicesPages(query: string) {
  try {
    // Get total number of pages based on whether a search query exists
    if (!query) {
      const response = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.invoicesId,
        [
          Query.limit(1), // Get only meta info by limiting to 1 item
        ]
      );
      return Math.ceil(response.total / ITEMS_PER_PAGE);
    }

    // If there's a search query, we need to filter manually
    // since Appwrite doesn't support full text search natively.
    const invoices = await getInvoices();
    const customers = await getCustomersMap();
    const q = query.toLowerCase();

    const filtered = invoices.filter((inv) => {
      const c = customers.get(inv.customer_id);
      const values = [
        c?.name ?? "",
        c?.email ?? "",
        inv.status,
        inv.amount.toString(),
        inv.date,
      ];
      return values.some((v) => v.toLowerCase().includes(q));
    });

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Failed to fetch total pages:", error);
    return 1;
  }
}

// CREATE, UPDATE, DELETE ACTIONS
export async function createInvoice(formData: FormData): Promise<Invoice> {
  const parsed = CreateInvoiceSchema.parse({
    customer_id: formData.get("customer_id") as string,
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const { customer_id, amount, status } = parsed;

  await database.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.collections.invoicesId,
    "unique()",
    {
      customer_id,
      amount: Number(amount) * 100,
      status,
      date: new Date().toISOString().split("T")[0],
    }
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  formData: FormData
): Promise<Invoice> {
  const parsed = UpdateInvoiceSchema.parse({
    customer_id: formData.get("customer_id"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: formData.get("date") || new Date().toISOString().split("T")[0],
  });

  const { customer_id, amount, status, date } = parsed;

  await database.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.collections.invoicesId,
    id,
    {
      customer_id,
      amount: Number(amount) * 100,
      status,
      date,
    }
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string): Promise<void> {
  await database.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.collections.invoicesId,
    id
  );

  revalidatePath("/dashboard/invoices");
}
