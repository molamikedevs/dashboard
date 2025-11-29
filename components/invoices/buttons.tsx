import Link from 'next/link';
import { Plus, SquarePen, Trash2 } from "lucide-react";

interface CreateButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function CreateButton({
  href,
  label,
  className = "",
}: CreateButtonProps) {
  return (
    <Link
      href={href}
      className={`flex h-10 items-center rounded-lg bg-blue-600 text-white px-4 text-sm font-medium transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}>
      <span className="hidden md:block">{label}</span>
      <Plus className="h-5 md:ml-4" />
    </Link>
  );
}

interface UpdateButtonProps {
  href: string;
  ariaLabel?: string;
  className?: string;
}

export function UpdateButton({
  href,
  ariaLabel = "Edit",
  className = "",
}: UpdateButtonProps) {
  return (
    <Link
      href={href}
      className={`rounded-md border p-2 ${className}`}
      aria-label={ariaLabel}>
      <SquarePen className="w-5" />
    </Link>
  );
}

interface DeleteButtonProps {
  id: string;
  deleteAction: (id: string) => Promise<void>;
  ariaLabel?: string;
  className?: string;
}

export function DeleteButton({
  id,
  deleteAction,
  ariaLabel = "Delete",
  className,
}: DeleteButtonProps) {
  const handleDelete = deleteAction.bind(null, id);

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className={`rounded-md border p-2 ${className}`}
        aria-label={ariaLabel}>
        <span className="sr-only">{ariaLabel}</span>
        <Trash2 className="w-5" />
      </button>
    </form>
  );
}