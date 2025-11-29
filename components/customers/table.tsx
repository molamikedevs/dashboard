import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { fetchFilteredCustomers } from "@/lib/actions/action.customer";
import { CustomerActions } from "../customer-action";

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
                {customers?.map((customer) => (
                  <div
                    key={customer.$id}
                    className="mb-2 w-full rounded-md bg-custom-background p-4">
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
                            <CustomerActions customerId={customer.$id} />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="font-medium">
                          {formatBalance(customer.total_pending)}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="font-medium">
                          {formatBalance(customer.total_paid)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p className="text-gray-500">
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

                <tbody className="divide-y divide-custom-border bg-custom-background">
                  {customers.map((customer) => (
                    <tr
                      key={customer.$id}
                      className="hover:bg-blue-400 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-custom-foreground sm:pl-6 border-r border-custom-border">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={32}
                            height={32}
                          />
                          <p className="font-medium">{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-custom-foreground border-r border-custom-border">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-custom-foreground text-center border-r border-custom-border">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {customer.total_invoices}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-center border-r border-custom-border">
                        <span>{formatBalance(customer.total_pending)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-center border-r border-custom-border">
                        <span>{formatBalance(customer.total_paid)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <CustomerActions customerId={customer.$id} />
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