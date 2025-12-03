import { getCustomers } from "@/lib/actions/action.customer";
import Breadcrumbs from "@/components/invoices/breadcrumbs";
import Form from "@/components/invoices/create-form";

// This page should always be dynamic to fetch the latest customer data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Create Invoice",
};

export default async function Page() {
  const customers = await getCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
