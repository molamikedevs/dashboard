import { getCustomers } from "@/lib/actions/action.customer";
import Breadcrumbs from "@/components/invoices/breadcrumbs";
import Form from "@/components/invoices/create-form";

export const metadata = {
  title: "Create Invoice",
};

export default async function Page() {
  const customers = await getCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Create Customer",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
