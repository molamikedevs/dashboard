"use client";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteCustomer } from "@/lib/actions/action.customer";
import { deleteInvoice } from "@/lib/actions/action.invoice";
import Link from "next/link";
import DeleteModal from "./delete-modal";

interface ActionsProps {
  id: string;
  type: "customer" | "invoice";
  editPath?: string;
  onDeleteSuccess?: () => void;
}

export function ActionButtons({
  id,
  type,
  editPath,
  onDeleteSuccess,
}: ActionsProps) {
  // Determine the appropriate delete function based on type
  const getDeleteFunction = () => {
    switch (type) {
      case "customer":
        return deleteCustomer;
      case "invoice":
        return deleteInvoice;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  // Determine the default edit path if not provided
  const getDefaultEditPath = () => {
    switch (type) {
      case "customer":
        return `/dashboard/customers/${id}/edit`;
      case "invoice":
        return `/dashboard/invoices/${id}/edit`;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  const getSuccessMessage = () => {
    switch (type) {
      case "customer":
        return "Customer deleted successfully";
      case "invoice":
        return "Invoice deleted successfully";
      default:
        return "Item deleted successfully";
    }
  };

  const getErrorMessage = () => {
    switch (type) {
      case "customer":
        return "Failed to delete customer";
      case "invoice":
        return "Failed to delete invoice";
      default:
        return "Failed to delete item";
    }
  };

  const getDeleteMessage = () => {
    switch (type) {
      case "customer":
        return "Delete this customer?";
      case "invoice":
        return "Delete this invoice?";
      default:
        return "Delete this item?";
    }
  };

  const handleDelete = async () => {
    let toastId: number | string | undefined;

    // Show confirmation modal
    const confirmDelete = new Promise<boolean>((resolve, reject) => {
      toastId = toast.warning(
        <DeleteModal
          getDeleteMessage={getDeleteMessage}
          resolve={resolve}
          reject={reject}
        />,
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    });

    try {
      await confirmDelete;

      const deleteFunction = getDeleteFunction();
      await deleteFunction(id);

      toast.success(getSuccessMessage());
      onDeleteSuccess?.();
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      if (error instanceof Error && error.message !== "Cancelled") {
        console.error(`Failed to delete ${type}:`, error);
        toast.error(getErrorMessage());
      }
    }
  };

  const finalEditPath = editPath || getDefaultEditPath();

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Link
        href={finalEditPath}
        className="flex items-center justify-center w-8 h-8 rounded-md text-blue-500 hover:bg-blue-300 transition-colors border border-blue-200"
        title={`Edit ${type}`}
        aria-label={`Edit ${type} ${id}`}>
        <Pencil className="w-4 h-4 hover:text-blue-700" />
      </Link>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-8 h-8 rounded-md text-red-500 hover:bg-red-300 transition-colors border border-red-200"
        title={`Delete ${type}`}
        aria-label={`Delete ${type} ${id}`}>
        <Trash2 className="w-4 h-4 hover:text-red-700" />
      </button>
    </div>
  );
}