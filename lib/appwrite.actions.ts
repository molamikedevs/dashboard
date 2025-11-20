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
