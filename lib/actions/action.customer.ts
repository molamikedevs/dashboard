import { Customer, Invoice } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";
import { getInvoices } from "./action.invoice";
import { formatCurrency, ITEMS_PER_PAGE } from "../utils";

// =====================================================
// Fetch Customers as Map (for JOIN-like operations)
// =====================================================

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

// =====================================================
// Fetch Customers as Array (for UI lists)
// =====================================================

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

// =====================================================
// Fetch Customers with Invoice Stats
// =====================================================
export async function getCustomersWithStats() {
  try {
    const [customers, invoices] = await Promise.all([
      getCustomers(),
      getInvoices(),
    ]);

    // Group invoices by customer_id and calculate stats
    const invoicesByCustomer = invoices.reduce((acc, invoice) => {
      if (!acc[invoice.customer_id]) {
        acc[invoice.customer_id] = [];
      }
      acc[invoice.customer_id].push(invoice);
      return acc;
    }, {} as Record<string, Invoice[]>);

    // Merge customer data with invoice stats
    const customersWithStats = customers.map((customer) => {
      const customerInvoices = invoicesByCustomer[customer.$id] || [];

      const total_invoices = customerInvoices.length;
      const total_pending = customerInvoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0);
      const total_paid = customerInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        ...customer,
        total_invoices,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });

    return customersWithStats;
  } catch (error) {
    console.error("Error merging customer data with invoices:", error);
    return [];
  }
}

// =====================================================
// Fetch Customers Pages (for Pagination)
// =====================================================
export async function fetchCustomersPages(query: string) {
  try {
    const customersWithStats = await getCustomersWithStats();
    const q = query.toLowerCase();

    const filtered = customersWithStats.filter((customer) => {
      const values = [
        customer.name ?? "",
        customer.email ?? "",
        customer.total_invoices?.toString() ?? "",
        customer.total_pending ?? "",
        customer.total_paid ?? "",
      ];
      return values.some((v) => v.toLowerCase().includes(q));
    });

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching customer pages:", error);
    return 1;
  }
}

// =====================================================
// Get Filtered Customers with Pagination
// =====================================================
export async function getFilteredCustomers(query: string, currentPage: number) {
  try {
    const customersWithStats = await getCustomersWithStats();
    const q = query.toLowerCase();

    const filtered = customersWithStats.filter((customer) => {
      const values = [
        customer.name ?? "",
        customer.email ?? "",
        customer.total_invoices?.toString() ?? "",
        customer.total_pending ?? "",
        customer.total_paid ?? "",
      ];
      return values.some((v) => v.toLowerCase().includes(q));
    });

    // Implement pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filtered.slice(startIndex, endIndex);
  } catch (error) {
    console.error("Error filtering customers:", error);
    return [];
  }
}

// =====================================================
// Get Total Customers Count
// =====================================================
export async function getAllCustomersCount() {
  try {
    const customers = await getCustomers();
    return customers.length;
  } catch (error) {
    console.error("Error fetching customers count:", error);
    return 0;
  }
}
