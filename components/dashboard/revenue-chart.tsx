

import { generateYAxis } from "@/lib/utils";
import { Revenue } from "@/types";
import { Calendar } from "lucide-react";

export default async function RevenueChart({ revenue }: { revenue: Revenue[] }) {
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-500">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl font-serif">Recent Revenue</h2>

      <div className="rounded-xl bg-custom-muted p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 bg-custom-background rounded-md p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm sm:flex"
            style={{ height: `${chartHeight}px` }}>
            {yAxisLabels.map((label) => (
              <p className="text-gray-400" key={label}>
                {label}
              </p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-400"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}></div>
              <p className="-rotate-90 text-sm sm:rotate-0 text-gray-400">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-400 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
