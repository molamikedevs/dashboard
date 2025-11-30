import Image from "next/image";
import { fetchFilteredInvoices } from "@/lib/actions/action.invoice";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
import { ActionButtons } from "../common/action-buttons";
import InvoiceStatus from "./status";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-custom-muted p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-custom-background p-4">
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{ borderColor: "var(--border)" }}>
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-custom-muted-foreground">
                      {invoice.email}
                    </p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium text-custom-foreground">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-custom-foreground">
                      {formatDateToLocal(invoice.date)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ActionButtons
                      id={invoice.id}
                      type="invoice"
                      editPath={`/dashboard/invoices/${invoice.id}/edit`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full rounded-md text-custom-foreground md:table">
            <thead className="rounded-md bg-custom-muted text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-8">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  Actions
                </th>
                <th scope="col" className="sr-only">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y bg-custom-background"
              style={{ borderColor: "var(--border)" }}>
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  style={{ borderColor: "var(--border)" }}>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 shrink-0">
                        <Image
                          src={invoice.image_url}
                          className="rounded-full object-cover w-full h-full"
                          width={28}
                          height={28}
                          alt={`${invoice.name}'s profile picture`}
                        />
                      </div>
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <ActionButtons
                        id={invoice.id}
                        type="invoice"
                        editPath={`/dashboard/invoices/${invoice.id}/edit`}
                      />
                    </div>
                  </td>
                  <td className="sr-only"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
