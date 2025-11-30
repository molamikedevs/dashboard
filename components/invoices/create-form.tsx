"use client";


import Link from "next/link";
import { Check, Clock, Receipt, User } from "lucide-react";
import { createInvoice } from "@/lib/actions/action.invoice";
import { Button } from "../common/button";
import { Customer } from "@/types";
import useFormValidation from "@/hooks/use-form-validation";
import ErrorInput from "../common/error-input";

export default function CreateInvoiceForm({
  customers,
}: {
  customers: Customer[];
}) {
  const initialValues = {
    customer_id: "",
    amount: "",
    status: "",
  };

  const validationRules = {
    customer_id: { required: true },
    amount: {
      required: true,
      pattern: /^\d+(\.\d{1,2})?$/, // Validates decimal numbers
    },
    status: { required: true },
  };

  const {
    values,
    errors,
    handleChange,
    validate,
    isSubmitting,
    setIsSubmitting,
  } = useFormValidation(initialValues, validationRules);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("customer_id", values.customer_id);
      formData.append("amount", values.amount);
      formData.append("status", values.status);

      await createInvoice(formData);
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6"
      aria-label="Create Invoice Form">
      <div className="rounded-md bg-custom-muted text-custom-foreground p-4 md:p-6">
        {/* Customer */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customer_id"
              value={values.customer_id}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm ${
                errors.customer_id
                  ? "border-red-500"
                  : "border-custom-border bg-custom-muted text-custom-foreground"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.$id} value={c.$id}>
                  {c.name}
                </option>
              ))}
            </select>
            <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] text-gray-500 -translate-y-1/2" />
          </div>
          <ErrorInput message={errors.customer_id} />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              value={values.amount}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm ${
                errors.amount ? "border-red-500" : "border-gray-200"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            <Receipt className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] text-gray-500 -translate-y-1/2" />
          </div>
          <ErrorInput message={errors.amount} />
        </div>

        {/* Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border bg-custom-muted px-3.5 py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  checked={values.status === "pending"}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`h-4 w-4 cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <label
                  htmlFor="pending"
                  className={`ml-2 flex items-center gap-1.5 text-xs font-medium ${
                    isSubmitting ? "opacity-50" : ""
                  }`}>
                  Pending <Clock className="h-4 w-4" />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  checked={values.status === "paid"}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`h-4 w-4 cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <label
                  htmlFor="paid"
                  className={`ml-2 flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full text-xs font-medium text-white ${
                    isSubmitting ? "opacity-50" : ""
                  }`}>
                  Paid <Check className="h-4 w-4" />
                </label>
              </div>
            </div>
            <ErrorInput message={errors.status} />
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className={`flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}>
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}