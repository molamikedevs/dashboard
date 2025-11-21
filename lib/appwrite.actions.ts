import { FilterInvoice, InvoicesTable, LatestInvoice, Revenue } from "@/types";
import { database, appwriteConfig } from "./appwrite-config";

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

// Fetch latest invoices with customer details
export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();

  return invoices.map((inv) => {
    const customer = customers.get(inv.customer_id);

    return {
      id: inv.$id,
      amount: inv.amount,
      status: inv.status,
      date: inv.date,
      name: customer?.name,
      email: customer?.email,
      image_url: customer?.image_url,
    };
  });
}

// Filter invoices based on a search query
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
  limit: number = 10
): Promise<InvoicesTable[]> {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();
  const itemsPerPage = limit;

  // Filter invoices based on the query
  const filteredInvoices = invoices.filter((inv) => {
    const customer = customers.get(inv.customer_id);
    const filterData: FilterInvoice = {
      name: customer?.name || "",
      email: customer?.email || "",
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
    };
    return Object.values(filterData).some((value) =>
      value.toString().toLowerCase().includes(query.toLowerCase())
    );
  });

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Map the paginated invoices to include customer details
  return paginatedInvoices.map((inv) => {
    const customer = customers.get(inv.customer_id);

    return {
      id: inv.$id,
      customer_id: inv.customer_id,
      name: customer?.name || "",
      email: customer?.email || "",
      image_url: customer?.image_url || "",
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
    };
  });
}
