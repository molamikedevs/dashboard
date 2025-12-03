import { Banknote, Clock4, Inbox, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getInvoices } from "@/lib/actions/action.invoice";
import { getCustomers } from "@/lib/actions/action.customer";

const iconMap = {
  collected: Banknote,
  customers: Users,
  pending: Clock4,
  invoices: Inbox,
};

export default async function CardWrapper() {
  const invoiceList = await getInvoices();
  const allCustomers = await getCustomers();

  const totalPaidInvoices = invoiceList
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPendingInvoices = invoiceList
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  const numberOfInvoices = invoiceList.length;
  const numberOfCustomers = allCustomers.length;

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
    <div className="rounded-xl p-2 shadow-sm bg-custom-muted">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-400" /> : null}
        <h2 className="ml-2 text-sm font-medium text-gray-400">{title}</h2>
      </div>
      <p className="rounded-xl px-4 py-8 text-center text-xl md:text-2xl bg-custom-background text-custom-foreground">
        {type === "collected" || type === "pending"
          ? formatCurrency(value as number)
          : value}
      </p>
    </div>
  );
}