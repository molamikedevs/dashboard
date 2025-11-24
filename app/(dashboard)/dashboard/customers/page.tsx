import {
  fetchCustomersPages,
  getFilteredCustomers,
  getAllCustomersCount,
} from "@/lib/actions/action.customer";
import { Users } from "lucide-react";
import { CustomerCard } from "./customer-card";
import Search from "@/components/search";
import { Suspense } from "react";
import Pagination from "@/components/invoices/pagination";
import { CreateCustomer } from "./create-customer";
import { CustomersGridSkeleton } from "@/components/skeletons";

export const metadata = {
  title: "Customers",
};

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function CustomersPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";
  const currentPage = parseInt(resolvedParams.page || "1");

  // Fetch data in parallel
  const [totalPages, filteredCustomers, totalCustomersCount] =
    await Promise.all([
      fetchCustomersPages(query),
      getFilteredCustomers(query, currentPage),
      getAllCustomersCount(),
    ]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-custom-foreground mb-2">
          Customers
        </h1>
        <p className="text-custom-muted-foreground">
          Manage your customers and their invoices
        </p>
      </div>

      {/* Stats and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-custom-muted rounded-lg p-3">
            <Users className="w-6 h-6 text-custom-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-custom-foreground">
              {totalCustomersCount}
            </p>
            <p className="text-sm text-custom-muted-foreground">
              Total Customers
            </p>
          </div>
        </div>

        <div className="flex space-x-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial min-w-[300px]">
            <Search
              placeholder="Search customers..."
              route="/dashboard/customers"
              imgSrc="/icons/search.svg"
              otherClasses="flex-1"
              iconPosition="left"
            />
          </div>

          {/* Add Customer Button */}
          <CreateCustomer />
        </div>
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-custom-muted rounded-xl">
          <Users className="w-12 h-12 text-custom-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-custom-foreground mb-2">
            {query ? "No customers found" : "No customers yet"}
          </h3>
          <p className="text-custom-muted-foreground">
            {query
              ? "Try adjusting your search terms."
              : "Get started by adding your first customer."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Suspense
              key={query + currentPage}
              fallback={<CustomersGridSkeleton />}>
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer.$id} customer={customer} />
              ))}
            </Suspense>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
