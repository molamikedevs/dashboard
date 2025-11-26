"use server";

import { ErrorType, Invoice, LatestInvoice } from "@/types";
import { database, appwriteConfig } from "../appwrite-config";
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

export async function createInvoice(
  _prevState: ErrorType,
  formData: FormData
): Promise<ErrorType> {
  try {
    const parsed = CreateInvoiceSchema.safeParse({
      customer_id: formData.get("customer_id") as string,
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
  } catch (err) {
    console.error("Failed to create invoice:", err);
    return {
      success: false,
      errors: { general: "Something went wrong. Try again later." },
      values: {
        customer_id: String(formData.get("customer_id") ?? ""),
        amount: String(formData.get("amount") ?? ""),
        status: String(formData.get("status") ?? ""),
      },
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  formData: FormData
): Promise<ErrorType | Invoice> {
  try {
    const parsed = UpdateInvoiceSchema.safeParse({
      customer_id: formData.get("customer_id"),
      amount: formData.get("amount"),
      status: formData.get("status"),
      date: formData.get("date") || new Date().toISOString().split("T")[0],
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

    const { customer_id, amount, status, date } = parsed.data;

    await database.updateDocument(
      appwriteConfig.databaseId,
      "invoice-table",
      id,
      {
        amount: amount * 100,
        status,
        customer_id,
        date,
      }
    );

    revalidatePath("/dashboard/invoices");

    // Throw the redirect to properly interrupt execution
    throw redirect("/dashboard/invoices");
  } catch (err) {
    // Check if this is a redirect error
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
      throw err; // Re-throw redirect errors
    }

    console.error("Failed to update invoice:", err);
    return {
      success: false,
      errors: { general: "Unable to update invoice at this time." },
      values: {
        customer_id: String(formData.get("customer_id") ?? ""),
        amount: String(formData.get("amount") ?? ""),
        status: String(formData.get("status") ?? ""),
      },
    };
  }
}



export async function deleteInvoice(id: string): Promise<void> {
  await database.deleteDocument(appwriteConfig.databaseId, "invoice-table", id);

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
