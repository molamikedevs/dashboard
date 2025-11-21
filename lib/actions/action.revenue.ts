import { Revenue } from "@/types";
import { appwriteConfig, database } from "../appwrite-config";

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
    throw new Error("Failed to fetch revenue data", { cause: error });
  }
}