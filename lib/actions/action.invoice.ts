"use server";

import { Invoice, LatestInvoice } from "@/types";
import { database, appwriteConfig } from "../appwrite-config";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FormSchema } from "../validation";
import { getCustomersMap } from "./action.customer";
import { isAppwriteError } from "../utils";

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

// ===============================
// Get Invoice By ID
// ===============================

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

// ===============================
// Latest Invoices (merged w/ customers)
// ===============================

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

const ITEMS_PER_PAGE = 5;

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

// ===============================
// Page Count
// ===============================

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

// ===============================
// Create Invoice
// ===============================

type CreateInvoiceState = {
  success: boolean;
  errors: Record<string, string> | null;
  values: Record<string, string> | null;
};

export async function createInvoice(
  _prevState: CreateInvoiceState,
  formData: FormData
): Promise<CreateInvoiceState> {
  try {
    const parsed = FormSchema.safeParse({
      customer_id: formData.get("customer_id"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path?.[0]) errors[err.path[0]] = err.message;
      });

      return {
        success: false,
        errors,
        values: {
          customer_id: String(formData.get("customer_id") ?? ""),
          amount: String(formData.get("amount") ?? ""),
          status: String(formData.get("status") ?? ""),
        },
      };
    }

    const { customer_id, amount, status } = parsed.data;

    await database.createDocument(
      appwriteConfig.databaseId,
      "invoice-table",
      "unique()",
      {
        customer_id,
        amount: amount * 100,
        status,
        date: new Date().toISOString().split("T")[0],
      }
    );

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
  } catch (err) {
    console.error("Failed to create invoice:", err);
    return {
      success: false,
      errors: { general: "Something went wrong. Try again later." },
      values: null,
    };
  }
}

// ===============================
// Update Invoice
// ===============================

export async function updateInvoice(
  id: string,
  formData: FormData
): Promise<Invoice> {
  try {
    const amount = Number(formData.get("amount")) * 100;
    const status = String(formData.get("status"));
    const customer_id = String(formData.get("customer_id"));

    const response = await database.updateDocument(
      appwriteConfig.databaseId,
      "invoice-table",
      id,
      {
        amount,
        status,
        customer_id,
        date: new Date().toISOString().split("T")[0],
      }
    );

    // Only triggers after SUCCESS
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");

    return {
      $id: response.$id,
      customer_id: response.customer_id,
      amount: response.amount,
      status: response.status,
      date: response.date,
    };
  } catch (err) {
    console.error("Failed to update invoice:", err);
    throw new Error("Unable to update invoice at this time.");
  }
}

// ===============================
// Delete Invoice
// ===============================

export async function deleteInvoice(id: string): Promise<void> {
  await database.deleteDocument(appwriteConfig.databaseId, "invoice-table", id);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
