// components/customer-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, FileText } from 'lucide-react';

interface CustomerCardProps {
  customer: {
    $id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices?: number;
    total_pending?: string; 
    total_paid?: string; 
  };
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link href={`/dashboard/customers/${customer.$id}`}>
      <div className="rounded-xl bg-custom-muted p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={customer.image_url || '/default-avatar.png'}
                alt={`${customer.name}'s profile picture`}
                className="rounded-full w-12 h-12 object-cover"
                width={48}
                height={48}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-custom-foreground truncate">
                {customer.name}
              </h3>
              <div className="flex items-center mt-1 text-custom-muted-foreground">
                <Mail className="w-4 h-4 mr-1 shrink-0" />
                <p className="text-sm truncate">{customer.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-custom-background rounded-lg p-3">
            <FileText className="w-4 h-4 text-custom-muted-foreground mx-auto mb-1" />
            <p className="text-sm text-custom-foreground font-semibold">
              {customer.total_invoices ?? 0}
            </p>
            <p className="text-xs text-custom-muted-foreground">Invoices</p>
          </div>
          <div className="bg-custom-background rounded-lg p-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-1"></div>
            <p className="text-sm text-custom-foreground font-semibold">
              {customer.total_pending || '$0.00'}
            </p>
            <p className="text-xs text-custom-muted-foreground">Pending</p>
          </div>
          <div className="bg-custom-background rounded-lg p-3">
            <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-1"></div>
            <p className="text-sm text-custom-foreground font-semibold">
              {customer.total_paid || '$0.00'}
            </p>
            <p className="text-xs text-custom-muted-foreground">Paid</p>
          </div>
        </div>
      </div>
    </Link>
  );
}