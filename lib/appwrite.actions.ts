import { Revenue } from '@/types';
import { database, appwriteConfig } from './appwrite-config';

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
export async function getLatestInvoices() {
  const invoices = await getInvoices();
  const customers = await getCustomersMap();

  console.log("Customer IDs:", [...customers.keys()]);
  console.log(
    "Invoice customer_id:",
    invoices.map((i) => i.customer_id)
  );

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




