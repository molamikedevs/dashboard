import { Customer, Invoice, LatestInvoice, Revenue } from "@/types";
import { database, appwriteConfig } from "./appwrite-config";
import { redirect } from "next/navigation";

export async function getRevenue(): Promise<Revenue[]> {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      "revenue"
    );

    return response.documents.map((doc) => ({
      month: doc.month,
      revenue: doc.revenue,
    }));
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return [];
  }
}

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

// Fetch all invoices
export async function getInvoices() {
  const response = await database.listDocuments(
    appwriteConfig.databaseId,
    "invoice-table"
  );

  return response.documents;
}

export async function fetchCustomers(): Promise<Customer[]> {
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

export async function createInvoice(formData: FormData): Promise<Invoice> {
  const customerId = formData.get("customer_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const status = formData.get("status") as "pending" | "paid";

  const response = await database.createDocument(
    appwriteConfig.databaseId,
    "invoice-table",
    "unique()",
    {
      customer_id: customerId,
      amount,
      status,
      date: new Date().toISOString(),
    }
  );

  redirect("/dashboard/invoices");

  return {
    $id: response.$id,
    customer_id: response.customer_id,
    amount: response.amount,
    status: response.status,
    date: response.date,
  };
}
