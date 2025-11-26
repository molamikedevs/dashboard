"use server";

import { Customer } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";
import { getInvoices } from "./action.invoice";
import { ITEMS_PER_PAGE } from "../utils";

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
