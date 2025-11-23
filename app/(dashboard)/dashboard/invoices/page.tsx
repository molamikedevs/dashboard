import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { fetchInvoicesPages } from "@/lib/actions/action.invoice";

import Search from "@/components/search";
import InvoicesTable from "@/components/invoices/table";
import Pagination from "@/components/invoices/pagination";
import { CreateInvoice } from "@/components/invoices/buttons";

interface Props {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const searchTerms = await searchParams;
  const query = searchTerms?.query || "";
  const currentPage = Number(searchTerms?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl front-serif">Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
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
