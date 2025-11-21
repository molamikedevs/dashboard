'use server';

import { Invoice, LatestInvoice } from "@/types";
import { database, appwriteConfig } from "../appwrite-config";
import { redirect } from "next/navigation";
import { FormSchema } from "../validation";
import { revalidatePath } from "next/cache";
import { getCustomersMap } from "./action.customer";



// Fetch all invoices
export async function getInvoices(): Promise<Invoice[]> {
  const response = await database.listDocuments(
    appwriteConfig.databaseId,
    "invoice-table"
  );

  return response.documents.map((doc) => ({
    $id: doc.$id,
    customer_id: doc.customer_id,
    amount: doc.amount,
    status: doc.status,
    date: doc.date,
  }));
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice> {
  try {
    const document = await database.getDocument(
      appwriteConfig.databaseId,
      "invoice-table",
      id
    );
    return {
      $id: document.$id,
      customer_id: document.customer_id,
      amount: document.amount,
      status: document.status,
      date: document.date,
    };
  } catch (error) {
    throw new Error("Invoice not found", { cause: error });
  }
}

// Fetch latest invoices with customer details
export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();

  // 1. Merge invoice + customer
  const merged = invoices.map((inv) => {
    const c = customers.get(inv.customer_id);
    return {
      $id: inv.$id,
      amount: inv.amount,
      status: inv.status,
      date: inv.date,
      name: c?.name,
      email: c?.email,
      image_url: c?.image_url,
    };
  });

  // 2. Sort by date DESC (latest first)
  merged.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 3. Return only the latest 6
  return merged.slice(0, 5);
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Step 1: fetch raw data
  const invoices = await getInvoices();
  const customersMap = await getCustomersMap();

  // Step 2: merge invoice + customer into a single list (mimicking SQL JOIN)
  const merged = invoices.map((inv) => {
    const c = customersMap.get(inv.customer_id);
    return {
      id: inv.$id,
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
      name: c?.name || "",
      email: c?.email || "",
      image_url: c?.image_url || "",
    };
  });

  // Step 3: filter
  const lower = query.toLowerCase();
  const filtered = merged.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.email.toLowerCase().includes(lower) ||
      item.status.toLowerCase().includes(lower) ||
      item.amount.toString().includes(lower) ||
      item.date.toString().includes(lower)
  );

  // Step 4: sort by date (DESC) just like SQL ORDER BY invoices.date DESC
  filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Step 5: paginate (mimicking LIMIT & OFFSET)
  const paginated = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return paginated;
}

export async function fetchInvoicesPages(query: string) {
  const invoices = await getInvoices();
  const customersMap = await getCustomersMap();

  const merged = invoices.map((inv) => {
    const c = customersMap.get(inv.customer_id);
    return {
      name: c?.name || "",
      email: c?.email || "",
      status: inv.status,
      amount: inv.amount,
      date: inv.date,
    };
  });

  const lower = query.toLowerCase();
  const filtered = merged.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.email.toLowerCase().includes(lower) ||
      item.status.toLowerCase().includes(lower) ||
      item.amount.toString().includes(lower) ||
      item.date.toString().includes(lower)
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return totalPages;
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData): Promise<Invoice> {
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get("customer_id"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  const response = await database.createDocument(
    appwriteConfig.databaseId,
    "invoice-table",
    "unique()",
    {
      customer_id,
      amount: amountInCents,
      status,
      date,
    }
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  return {
    $id: response.$id,
    customer_id: response.customer_id,
    amount: response.amount,
    status: response.status,
    date: response.date,
  };
}

export async function updateInvoice(
  id: string,
  formData: FormData
): Promise<Invoice> {
  const amount = Number(formData.get("amount")) * 100;
  const status = formData.get("status") as string;
  const customer_id = formData.get("customer_id") as string;

  const date = new Date().toISOString().split("T")[0];

  const response = await database.updateDocument(
    appwriteConfig.databaseId,
    "invoice-table",
    id,
    {
      amount,
      status,
      date,
      customer_id,
    }
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  return {
    $id: response.$id,
    customer_id: response.customer_id,
    amount: response.amount,
    status: response.status,
    date: response.date,
  };
}

export async function deleteInvoice(id: string): Promise<void> {
  await database.deleteDocument(
    appwriteConfig.databaseId,
    "invoice-table",
    id
  );

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

}