const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-custom-muted p-2 shadow-sm`}>
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-custom-muted" />
        <div className="ml-2 h-6 w-16 rounded-md bg-custom-muted text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-custom-background px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-custom-muted" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-custom-muted" />
      <div className="rounded-xl bg-custom-muted p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-custom-background p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-custom-muted" />
          <div className="ml-2 h-4 w-20 rounded-md bg-custom-muted" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-custom-muted py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-custom-muted" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-custom-muted" />
          <div className="mt-2 h-4 w-12 rounded-md bg-custom-muted" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-custom-muted" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-custom-muted" />
      <div className="flex grow flex-col justify-between rounded-xl bg-custom-muted p-4">
        <div className="bg-custom-background px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-custom-muted" />
          <div className="ml-2 h-4 w-20 rounded-md bg-custom-muted" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-custom-muted`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-custom-muted last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-custom-muted"></div>
          <div className="h-6 w-24 rounded bg-custom-muted"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-custom-muted"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-custom-muted"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-custom-muted"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-custom-muted"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-custom-muted"></div>
          <div className="h-[38px] w-[38px] rounded bg-custom-muted"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-custom-background p-4">
      <div className="flex items-center justify-between border-b border-custom-muted pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-custom-muted"></div>
          <div className="h-6 w-16 rounded bg-custom-muted"></div>
        </div>
        <div className="h-6 w-16 rounded bg-custom-muted"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-custom-muted"></div>
          <div className="mt-2 h-6 w-24 rounded bg-custom-muted"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-custom-muted"></div>
          <div className="h-10 w-10 rounded bg-custom-muted"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-custom-muted p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full md:table">
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
            <tbody className="bg-custom-background">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Customer Skeletons
export function CustomerCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-custom-muted p-4 border border-custom-border`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="rounded-full bg-gray-300 w-12 h-12"></div>
            <div className="absolute -bottom-1 -right-1 bg-gray-300 rounded-full p-1">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-5 w-32 rounded-md bg-gray-300 mb-2"></div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 rounded bg-gray-300 mr-1"></div>
              <div className="h-4 w-24 rounded-md bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stats Skeleton */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-custom-background rounded-lg p-3">
          <div className="w-4 h-4 rounded bg-gray-300 mx-auto mb-1"></div>
          <div className="h-4 w-6 rounded-md bg-gray-300 mx-auto mb-1"></div>
          <div className="h-3 w-12 rounded-md bg-gray-300 mx-auto"></div>
        </div>
        <div className="bg-custom-background rounded-lg p-3">
          <div className="w-4 h-4 rounded-full bg-gray-300 mx-auto mb-1"></div>
          <div className="h-4 w-10 rounded-md bg-gray-300 mx-auto mb-1"></div>
          <div className="h-3 w-12 rounded-md bg-gray-300 mx-auto"></div>
        </div>
        <div className="bg-custom-background rounded-lg p-3">
          <div className="w-4 h-4 rounded-full bg-gray-300 mx-auto mb-1"></div>
          <div className="h-4 w-10 rounded-md bg-gray-300 mx-auto mb-1"></div>
          <div className="h-3 w-12 rounded-md bg-gray-300 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function CustomersGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </>
  );
}

export function CustomerTableRowSkeleton() {
  return (
    <tr className="w-full border-b border-custom-border last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-custom-muted"></div>
          <div className="h-6 w-24 rounded bg-custom-muted"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-custom-muted"></div>
      </td>
      {/* Total Invoices */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-custom-muted"></div>
      </td>
      {/* Total Pending */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-20 rounded bg-custom-muted"></div>
      </td>
      {/* Total Paid */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-20 rounded bg-custom-muted"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-custom-muted"></div>
          <div className="h-[38px] w-[38px] rounded bg-custom-muted"></div>
        </div>
      </td>
    </tr>
  );
}

export function CustomersMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-custom-muted p-4">
      <div className="flex items-center justify-between border-b border-custom-border pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-custom-background"></div>
          <div className="h-6 w-16 rounded bg-custom-background"></div>
        </div>
        <div className="h-6 w-16 rounded bg-custom-background"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-custom-background"></div>
          <div className="mt-2 h-6 w-24 rounded bg-custom-background"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-custom-background"></div>
          <div className="h-10 w-10 rounded bg-custom-background"></div>
        </div>
      </div>
    </div>
  );
}

export function CustomersTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-custom-muted p-2 md:pt-0">
          <div className="md:hidden">
            <CustomersMobileSkeleton />
            <CustomersMobileSkeleton />
            <CustomersMobileSkeleton />
            <CustomersMobileSkeleton />
            <CustomersMobileSkeleton />
            <CustomersMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-custom-foreground md:table">
            <thead className="rounded-md bg-custom-muted text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Total Invoices
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Total Pending
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Total Paid
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-custom-background">
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className={`${shimmer} relative rounded-lg bg-custom-muted p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-20 rounded-md bg-custom-background mb-2"></div>
          <div className="h-8 w-24 rounded-md bg-custom-background"></div>
        </div>
        <div className="h-12 w-12 rounded-full bg-custom-background"></div>
      </div>
      <div className="mt-4">
        <div className="h-3 w-32 rounded-md bg-custom-background"></div>
      </div>
    </div>
  );
}

export function GlobalSkeleton() {
  return (
    <div className="min-h-screen bg-custom-background">
      {/* Header */}
      <div
        className={`${shimmer} relative border-b border-custom-border bg-custom-muted`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-custom-background"></div>
              <div className="ml-4 h-6 w-32 rounded-md bg-custom-background"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-custom-background"></div>
              <div className="h-10 w-24 rounded-md bg-custom-background"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="h-8 w-48 rounded-md bg-custom-muted mb-2"></div>
          <div className="h-4 w-64 rounded-md bg-custom-muted"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>

            {/* Main Table/Content */}
            <div className="rounded-lg bg-custom-muted p-4">
              <div className="mb-4 h-6 w-48 rounded-md bg-custom-background"></div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 rounded-md bg-custom-background"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Side Panel */}
            <div className="rounded-lg bg-custom-muted p-4">
              <div className="mb-4 h-6 w-32 rounded-md bg-custom-background"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-md bg-custom-background"></div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-custom-muted p-4">
              <div className="mb-4 h-6 w-40 rounded-md bg-custom-background"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-md bg-custom-background"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
