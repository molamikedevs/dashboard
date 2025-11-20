import { Banknote, Clock4, Inbox, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getInvoices, getLatestInvoices } from "@/lib/appwrite.actions";

const iconMap = {
  collected: Banknote,
  customers: Users,
  pending: Clock4,
  invoices: Inbox,
};

export default async function CardWrapper() {
  const invoiceList = await getInvoices();
  const latestInvoicesData = await getLatestInvoices();

  const totalPaidInvoices = invoiceList
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPendingInvoices = invoiceList
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  const numberOfInvoices = latestInvoicesData.length;

  const numberOfCustomers = new Set(invoiceList.map((i) => i.customer_id)).size;
  return (
    <>
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium text-zinc-800">{title}</h3>
      </div>
      <p
        className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl text-gray-600"
      >
        {type === 'collected' || type === 'pending' ? formatCurrency(value as number) : value}
      </p>
    </div>
  );
}
