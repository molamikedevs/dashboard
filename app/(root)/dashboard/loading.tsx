import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/common/skeletons";

export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="md:col-span-4">
        <CardsSkeleton />
      </div>
      <div className="md:col-span-2">
        <RevenueChartSkeleton />
      </div>
      <div className="md:col-span-2">
        <LatestInvoicesSkeleton />
      </div>
    </div>
  );
}
