import Link from 'next/link';
import { Plus } from "lucide-react";

interface CreateButtonProps {
  href: string;
  label: string;
  className?: string;
  ariaLabel?: string;
}

export function CreateButton({
  href,
  label,
  className = "",
  ariaLabel,
}: CreateButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`flex h-14 items-center rounded-lg bg-blue-600 text-white px-4 text-sm font-medium transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}>
      <span className="hidden md:block">{label}</span>
      <Plus className="h-5 md:ml-4" />
    </Link>
  );
}

