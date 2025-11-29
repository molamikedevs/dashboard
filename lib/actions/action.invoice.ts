"use server";

import { Invoice, LatestInvoice } from "@/types";
import { database, appwriteConfig } from "../appwrite-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "../validation";
import { getCustomersMap } from "./action.customer";
import { isAppwriteError, ITEMS_PER_PAGE } from "../utils";

// ===============================
// Fetch All Invoices
// ===============================

export async function getInvoices(): Promise<Invoice[]> {
  const res = await database.listDocuments(
    appwriteConfig.databaseId,
    "invoice-table"
  );

  return res.documents.map((doc) => ({
    $id: doc.$id,
    customer_id: doc.customer_id,
    amount: doc.amount,
    status: doc.status,
    date: doc.date,
  }));
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const doc = await database.getDocument(
      appwriteConfig.databaseId,
      "invoice-table",
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

export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();

  const merged = invoices
    .map((inv) => {
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
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return merged.slice(0, 5);
}

// ===============================
// Paginated + Filtered Fetch
// ===============================

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

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

  return merged.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchInvoicesPages(query: string) {
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
}

export async function createInvoice(formData: FormData) {
  const parsed = CreateInvoiceSchema.parse({
    customer_id: formData.get("customer_id") as string,
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const { customer_id, amount, status } = parsed;

  await database.createDocument(
    appwriteConfig.databaseId,
    "invoice-table",
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

export async function updateInvoice(id: string, formData: FormData) {
  const parsed = UpdateInvoiceSchema.parse({
    customer_id: formData.get("customer_id"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: formData.get("date") || new Date().toISOString().split("T")[0],
  });

  const { customer_id, amount, status, date } = parsed;

  await database.updateDocument(
    appwriteConfig.databaseId,
    "invoice-table",
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
  await database.deleteDocument(appwriteConfig.databaseId, "invoice-table", id);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
