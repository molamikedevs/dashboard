"use client";

import Link from "next/link";
import { User, Mail, Image as ImageIcon } from "lucide-react";
import { updateCustomer } from "@/lib/actions/action.customer";
import { Customer } from "@/types";
import { Button } from "@/components/button";
import ErrorInput from "../error-input";
import useFormValidation from "@/hooks/use-form-validation";
import Image from "next/image";

export default function EditCustomerForm({
  customer,
}: {
  customer: Customer;
}) {
  const initialValues = {
    name: customer.name,
    email: customer.email,
    image_url: customer.image_url,
  };

  const validationRules = {
    name: { required: true },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    image_url: { required: true },
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
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("image_url", values.image_url);

      await updateCustomer(customer.$id, formData);
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-custom-muted text-custom-foreground p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Customer Name
          </label>

          <div className="relative">
            <input
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              className={`peer block w-full rounded-md border bg-custom-muted py-2 pl-10 ${
                errors.name ? "border-red-500" : "border-custom-border"
              }`}
              placeholder="Enter customer name"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <ErrorInput message={errors.name} />
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Customer Email
          </label>

          <div className="relative">
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className={`peer block w-full rounded-md border bg-custom-muted py-2 pl-10 ${
                errors.email ? "border-red-500" : "border-custom-border"
              }`}
              placeholder="Enter customer email"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <ErrorInput message={errors.email} />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Profile Image URL
          </label>

          <div className="relative">
            <input
              name="image_url"
              type="url"
              value={values.image_url}
              onChange={handleChange}
              className={`peer block w-full rounded-md border bg-custom-muted py-2 pl-10 ${
                errors.image_url ? "border-red-500" : "border-custom-border"
              }`}
              placeholder="Enter image URL"
            />
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <ErrorInput message={errors.image_url} />
        </div>

        {/* Image Preview */}
        {values.image_url && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Image Preview
            </label>
            <div className="flex items-center gap-4">
              <Image
                src={values.image_url}
                width={64}
                height={64}
                alt="Customer preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.png';
                }}
              />
              <span className="text-sm text-gray-600">
                Current profile image
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Customer"}
        </Button>
      </div>
    </form>
  );
}