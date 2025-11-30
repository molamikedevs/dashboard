import { Users } from "lucide-react";
import { Suspense } from "react";
import { CustomersTableSkeleton } from "@/components/common/skeletons";
import {
  fetchCustomersPages,
  getCustomers,
} from "@/lib/actions/action.customer";

import CustomersTable from "@/components/customers/customer-table";
import Pagination from "@/components/common/pagination";
import Search from "@/components/common/search";
import { CreateButton } from "@/components/common/create-button";

export const metadata = {
  title: "Customers",
};

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { query = "" } = await searchParams;
  const currentPage = parseInt((await searchParams).page || "1", 10);
  const totalPages = await fetchCustomersPages(query);
  const allCustomers = await getCustomers();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-custom-foreground mb-2">
          Customers
        </h1>
        <p className="text-custom-muted-foreground">Customer management</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-custom-muted rounded-lg p-3">
            <Users className="w-6 h-6 text-custom-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-custom-foreground">
              {allCustomers.length}
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
          <CreateButton
            href="/dashboard/customers/create"
            label="Create Customer"
          />
        </div>
      </div>
      <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
