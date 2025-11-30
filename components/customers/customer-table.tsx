import Image from "next/image";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";
import { fetchFilteredCustomers } from "@/lib/actions/action.customer";
import { ActionButtons } from "../common/action-buttons";
import { Avatar } from "../common/avatar";

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = await fetchFilteredCustomers(query, currentPage);

  const formatBalance = (amount: number) => {
    return amount === 0 ? "-" : formatCurrency(amount);
  };

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-custom-muted p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer, i) => (
                  <div
                    key={customer.$id}
                    className={clsx(
                      "mb-2 w-full rounded-md bg-custom-background p-4",
                      {
                        "border-t": i !== 0,
                      }
                    )}
                    style={{
                      borderColor: i !== 0 ? "var(--border)" : "transparent",
                    }}>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="w-full">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image_url}
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p className="font-medium">{customer.name}</p>
                          </div>
                          <div className="relative z-20">
                            <ActionButtons
                              id={customer.$id}
                              type="customer"
                              editPath={`/dashboard/customers/${customer.$id}/edit`}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-custom-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex w-full items-center justify-between border-b py-5"
                      style={{ borderColor: "var(--border)" }}>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-custom-muted-foreground">
                          Pending
                        </p>
                        <p className="font-medium">
                          {formatBalance(customer.total_pending)}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-custom-muted-foreground">
                          Paid
                        </p>
                        <p className="font-medium">
                          {formatBalance(customer.total_paid)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p className="text-custom-muted-foreground">
                        {customer.total_invoices} invoices
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <table className="hidden min-w-full rounded-md text-custom-foreground md:table">
                <thead className="rounded-md bg-custom-muted text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium text-center">
                      Total Invoices
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium text-center">
                      Total Pending
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium text-center">
                      Total Paid
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-custom-background">
                  {customers.map((customer, i) => (
                    <tr
                      key={customer.$id}
                      className={clsx({
                        "border-t": i !== 0,
                      })}
                      style={{
                        borderColor: i !== 0 ? "var(--border)" : "transparent",
                      }}>
                      <td
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-custom-foreground sm:pl-6 border-r"
                        style={{ borderColor: "var(--border)" }}>
                        <div className="mb-2 flex items-center">
                          <Avatar
                            src={customer.image_url}
                            alt={`${customer.name}'s profile picture`}
                            name={customer.name}
                            size={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td
                        className="whitespace-nowrap px-4 py-4 text-sm text-custom-foreground border-r"
                        style={{ borderColor: "var(--border)" }}>
                        {customer.email}
                      </td>
                      <td
                        className="whitespace-nowrap px-4 py-4 text-sm text-custom-foreground text-center border-r"
                        style={{ borderColor: "var(--border)" }}>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {customer.total_invoices}
                        </span>
                      </td>
                      <td
                        className="whitespace-nowrap px-4 py-4 text-sm font-medium text-center border-r"
                        style={{ borderColor: "var(--border)" }}>
                        <span>{formatBalance(customer.total_pending)}</span>
                      </td>
                      <td
                        className="whitespace-nowrap px-4 py-4 text-sm font-medium text-center border-r"
                        style={{ borderColor: "var(--border)" }}>
                        <span>{formatBalance(customer.total_paid)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <ActionButtons
                            id={customer.$id}
                            type="customer"
                            editPath={`/dashboard/customers/${customer.$id}/edit`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
