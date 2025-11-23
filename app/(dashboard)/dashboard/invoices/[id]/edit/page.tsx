import { notFound } from "next/navigation";
import { getCustomers } from "@/lib/actions/action.customer";
import { getInvoiceById } from "@/lib/actions/action.invoice";
import Breadcrumbs from "@/components/invoices/breadcrumbs";
import EditInvoiceForm from "@/components/invoices/edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInvoice({ params }: Props) {
  const { id } = await params;
  const [invoice, customers] = await Promise.all([
    getInvoiceById(id),
    getCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </main>
  );
}
