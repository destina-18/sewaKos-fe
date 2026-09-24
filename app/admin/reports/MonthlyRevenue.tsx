import {
  formatRupiah,
} from "./helper";

import type {
  ChartItem,
} from "./types";

type MonthlyRevenueProps = {
  data: ChartItem[];
  currentYear: number;
  currentMonth: number;
};

export default function MonthlyRevenue({
  data,
  currentYear,
  currentMonth,
}: MonthlyRevenueProps) {
  return (
    <section className="rounded-[10px] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[13px] font-bold text-[#29354a]">
          Pendapatan per bulan
        </h2>

        <span className="text-[8px] text-[#aaa]">
          {currentYear}
        </span>
      </div>

      <div className="mt-3">
        {data.map(
          (
            item,
            index
          ) => {
            const isCurrentMonth =
              index === currentMonth;

            return (
              <div
                key={item.month}
                className="flex items-center justify-between border-b border-[#eeeeee] py-2 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 text-[8px] text-[#888]">
                    {item.month}
                  </span>

                  {isCurrentMonth && (
                    <span className="rounded-full bg-[#f7ead5] px-1.5 py-[2px] text-[6px] font-semibold text-[#a97827]">
                      Bulan ini
                    </span>
                  )}
                </div>

                <span className="text-[8px] font-medium text-[#555]">
                  {formatRupiah(
                    item.revenue
                  )}
                </span>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}