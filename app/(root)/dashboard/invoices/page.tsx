import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { fetchInvoicesPages, getInvoices } from "@/lib/actions/action.invoice";

import Search from "@/components/search";
import InvoicesTable from "@/components/invoices/table";
import Pagination from "@/components/invoices/pagination";
import { CreateInvoice } from "@/components/invoices/buttons";
import { Receipt } from "lucide-react";

export const metadata = {
  title: "Invoices",
};

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { query = "" } = await searchParams;
  const currentPage = parseInt((await searchParams).page || "1", 5);
  const totalPages = await fetchInvoicesPages(query);
  const invoices = await getInvoices();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-custom-foreground mb-2">
          Invoices
        </h1>
        <p className="text-custom-muted-foreground">
          Customer invoices management
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-custom-muted rounded-lg p-3">
            <Receipt className="w-6 h-6 text-custom-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-custom-foreground">
              {invoices.length}
            </p>
            <p className="text-sm text-custom-muted-foreground">
              Total Invoices
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
          <CreateInvoice />
        </div>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
