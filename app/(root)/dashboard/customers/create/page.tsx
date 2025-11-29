import Breadcrumbs from "@/components/invoices/breadcrumbs";
import CreateCustomerForm from "@/components/customers/create-customer";

export const metadata = {
  title: "Create Customer",
};

export default async function Page() {
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
      <CreateCustomerForm />
    </main>
  );
}
