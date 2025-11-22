"use server";

import { Revenue } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";

// =====================================================
// Fetch Revenue Data
// =====================================================

export async function getRevenue(): Promise<Revenue[]> {
  try {
    const res = await database.listDocuments(
      appwriteConfig.databaseId,
      "revenue"
    );

    return res.documents.map((doc) => ({
      month: doc.month,
      revenue: doc.revenue,
    }));
  } catch (err) {
    console.error("Failed to fetch revenue:", err);
    throw new Error("Unable to fetch revenue data.");
  }
}
