"use client";

import Link from "next/link";
import { Check, Clock, Receipt, User } from "lucide-react";
import { Customer } from "@/types";
import { createInvoice } from "@/lib/actions/action.invoice";
import { Button } from "../button";
import { useActionState } from "react";

export default function Form({ customers }: { customers: Customer[] }) {
  const [state, formAction] = useActionState(createInvoice, {
    success: false,
    errors: null,
    values: null,
  });

  return (
    <form action={formAction} className="mt-6">
      <div className="rounded-md bg-custom-muted text-custom-foreground p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customer_id"
              defaultValue={state.values?.customer_id ?? ""}
              aria-invalid={!!state.errors?.customer_id}
              className={`peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2 ${
                state.errors?.customer_id
                  ? "border-red-500"
                  : "border-custom-border bg-custom-muted text-custom-foreground"
              } placeholder:text-custom-foreground`}>
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.$id} value={customer.$id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.customer_id && (
            <p
              className="text-red-600 text-sm mt-1"
              role="alert"
              id="customer-error">
              {state.errors.customer_id}
            </p>
          )}
        </div>

        {/* Invoice Amount */}
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
              defaultValue={state.values?.amount ?? ""}
              aria-invalid={!!state.errors?.amount}
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                state.errors?.amount ? "border-red-500" : "border-gray-200"
              }`}
            />
            <Receipt className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state.errors?.amount && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {state.errors.amount}
            </p>
          )}
        </div>

        {/* Invoice Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border bg-custom-muted px-3.5 py-3">
            <div className="flex gap-4">
              {/* Pending */}
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={state.values?.status === "pending"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-custom-muted text-custom-foreground focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-custom-muted px-3 py-1.5 text-xs font-medium text-custom-foreground">
                  Pending <Clock className="h-4 w-4" />
                </label>
              </div>

              {/* Paid */}
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={state.values?.status === "paid"}
                  className="h-4 w-4 cursor-pointer border- bg-custom-muted text-custom-foreground focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium">
                  Paid <Check className="h-4 w-4" />
                </label>
              </div>
            </div>
            {state.errors?.status && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {state.errors.status}
              </p>
            )}
          </div>
        </fieldset>

        {/* General Form Error */}
        {state.errors && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {state.errors.error}
          </p>
        )}
      </div>

      {/* Form Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
