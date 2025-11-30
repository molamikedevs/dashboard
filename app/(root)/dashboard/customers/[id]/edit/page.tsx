import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/actions/action.customer";
import Breadcrumbs from "@/components/invoices/breadcrumbs";
import EditCustomerForm from "@/components/customers/edit-customer";

export const metadata = {
  title: "Edit Customer",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCustomer({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

 if (!customer) {
   notFound();
 }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Edit Customer",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  );
}