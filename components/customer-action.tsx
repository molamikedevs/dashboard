"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCustomer } from "@/lib/actions/action.customer";
import { toast } from "react-toastify";

export function CustomerActions({ customerId }: { customerId: string }) {
  const handleDelete = async () => {
    // Create a promise-based confirmation
    const confirmDelete = new Promise((resolve, reject) => {
      toast.warning(
        <div className="flex flex-col gap-2">
          <p className="font-medium">Delete this customer?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => resolve(true)}
              className="px-3 py-1 bg-red-300 text-sm rounded hover:bg-red-500"
            >
              Yes, delete
            </button>
            <button
              onClick={() => reject(new Error("Cancelled"))}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    try {
      await confirmDelete;
      // If user confirmed, proceed with deletion
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message !== "Cancelled") {
        console.error("Failed to delete customer:", error);
        toast.error("Failed to delete customer");
      }
      // If cancelled, close the toast
      toast.dismiss();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Link
        href={`/dashboard/customers/${customerId}/edit`}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-700 transition-colors border border-blue-200"
        title="Edit customer"
      >
        <Pencil className="w-4 h-4" />
      </Link>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-8 h-8 rounded-md text-red-500 hover:bg-gray-700 transition-colors border border-red-200"
        title="Delete customer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}