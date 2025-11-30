"use client";

import Link from "next/link";
import { Check, Clock, Receipt, User } from "lucide-react";
import { updateInvoice } from "@/lib/actions/action.invoice";
import { CustomerField, Invoice } from "@/types";
import { Button } from "@/components/common/button";
import ErrorInput from "../common/error-input";
import useFormValidation from "@/hooks/use-form-validation";

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: Invoice;
  customers: CustomerField[];
}) {


  const initialValues = {
    customer_id: invoice.customer_id,
    amount: invoice.amount.toString(),
    status: invoice.status,
  };

  const validationRules = {
    customer_id: { required: true },
    amount: {
      required: true,
      pattern: /^\d+(\.\d{1,2})?$/,
    },
    status: { required: true },
  };

  const { values, errors, handleChange, validate, isSubmitting, setIsSubmitting } = useFormValidation(
    initialValues,
    validationRules
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("customer_id", values.customer_id);
      formData.append("amount", values.amount);
      formData.append("status", values.status);

      await updateInvoice(invoice.$id, formData);
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-custom-muted text-custom-foreground p-4 md:p-6">
        {/* Customer */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Choose customer
          </label>

          <div className="relative">
            <select
              name="customer_id"
              value={values.customer_id}
              onChange={handleChange}
              className={`peer block w-full rounded-md border bg-custom-muted py-2 pl-10 ${
                errors.customer_id ? "border-red-500" : "border-custom-border"
              }`}>
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.$id} value={c.$id}>
                  {c.name}
                </option>
              ))}
            </select>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <ErrorInput message={errors.customer_id} />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>

          <div className="relative">
            <input
              name="amount"
              type="number"
              step="0.01"
              value={values.amount}
              onChange={handleChange}
              className={`peer block w-full rounded-md border py-2 pl-10 ${
                errors.amount ? "border-red-500" : "border-custom-border"
              }`}
            />
            <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <ErrorInput message={errors.amount} />
        </div>

        {/* Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>

          <div className="rounded-md border bg-custom-muted px-3.5 py-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={values.status === "pending"}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Pending <Clock className="h-4 w-4" />
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer bg-green-500 px-3 py-1.5 rounded-full text-white">
                <input
                  type="radio"
                  name="status"
                  value="paid"
                  checked={values.status === "paid"}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Paid <Check className="h-4 w-4" />
              </label>
            </div>

            <ErrorInput message={errors.status} />
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200">
          Cancel
        </Link>
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Invoice"}
        </Button>
      </div>
    </form>
  );
}
