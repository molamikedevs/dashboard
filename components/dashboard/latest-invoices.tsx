import clsx from "clsx";
import { RefreshCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getLatestInvoices } from "@/lib/actions/action.invoice";
import { Avatar } from "../common/avatar";

export default async function LatestInvoices() {
  const latestInvoice = await getLatestInvoices();

  if (!latestInvoice || latestInvoice.length === 0) {
    return <p className="mt-4 text-gray-500">No data available.</p>;
  }

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl font-serif ">Latest Invoices</h2>
      <div className="flex grow flex-col bg-custom-muted justify-between rounded-xl p-4">
        <div className="px-6 rounded-lg bg-custom-background">
          {latestInvoice.map((invoice, i) => {
            return (
              <div
                key={invoice.$id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
                style={{
                  borderColor: i !== 0 ? "var(--border)" : "transparent",
                }}>
                <div className="flex items-center">
                  <Avatar
                    src={invoice.image_url}
                    alt={`${invoice.name}'s profile picture`}
                    size={40}
                    className="mr-4"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base text-custom-foreground">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm sm:block text-custom-muted-foreground">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p className="truncate text-sm font-medium md:text-base font-serif text-custom-foreground">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <RefreshCcw className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-400 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
