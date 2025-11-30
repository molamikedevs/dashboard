
'use client';

import Link from "next/link";
import { useState } from "react";
import { Mail, User, Upload, X } from "lucide-react";
import { Button } from "../common/button";
import Image from "next/image";

import useFormValidation from "@/hooks/use-form-validation";
import ErrorInput from "../common/error-input";
import { createCustomer } from "@/lib/actions/action.customer";
import { useRouter } from "next/navigation";

export default function CreateCustomerForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    image_url: "",
  };

  const validationRules = {
    name: { required: true },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    image_url: { required: false },
  };

  const {
    values,
    errors,
    handleChange,
    validate,
    isSubmitting,
    setIsSubmitting,
  } = useFormValidation(initialValues, validationRules);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setFileName(file.name);
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName("");
    setSelectedFile(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please drop an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setFileName(file.name);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      // Append the file if selected
      if (selectedFile) {
        formData.append("image_url", selectedFile);
      }

      const result = await createCustomer(formData);

      if (result?.success) {
        // Reset form on success
        setPreviewUrl(null);
        setFileName("");
        setSelectedFile(null);

        // Redirect after successful creation
        router.push("/dashboard/customers?success=true");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="rounded-md bg-custom-muted text-custom-foreground p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name *
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Customer name..."
              value={values.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 ${
                errors.name
                  ? "border-red-500 bg-red-50"
                  : "border-custom-border bg-custom-muted text-custom-foreground"
              } placeholder:text-gray-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              required
              minLength={2}
              maxLength={100}
            />
            <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <ErrorInput message={errors.name} />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email *
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={values.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              required
            />
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <ErrorInput message={errors.email} />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Profile Image (Optional)
          </label>

          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              previewUrl
                ? "border-blue-500 bg-custom-muted"
                : "border-gray-300 hover:border-gray-400 bg-custom-muted"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() =>
              !isSubmitting && document.getElementById("image-upload")?.click()
            }>
            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="hidden"
            />

            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Image
                    width={96}
                    height={96}
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{fileName}</p>
                <p className="text-xs text-gray-500">Click to change image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className={`flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}>
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}