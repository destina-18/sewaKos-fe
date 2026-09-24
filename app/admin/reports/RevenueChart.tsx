import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CustomTooltip from "./CustomTooltip"; 

import type {
  ChartItem,
} from "./types";

type RevenueChartProps = {
  data: ChartItem[];
  currentYear: number;
};

export default function RevenueChart({
  data,
  currentYear,
}: RevenueChartProps) {
  return (
    <section className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="font-serif text-[14px] font-bold text-[#29354a]">
            Pendapatan bulanan
          </h2>

          <p className="mt-1 text-[9px] text-[#999]">
            Perkembangan pendapatan selama tahun{" "}
            {currentYear}.
          </p>
        </div>

        <span className="rounded-full bg-[#f7ead5] px-3 py-1.5 text-[8px] font-semibold text-[#a97827]">
          {currentYear}
        </span>
      </div>

      <div className="h-[390px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 15,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fontSize: 8,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(
                value
              ) => {
                const number =
                  Number(value);

                if (
                  number >= 1000000
                ) {
                  return `Rp${(
                    number / 1000000
                  ).toFixed(1)}jt`;
                }

                if (
                  number >= 1000
                ) {
                  return `Rp${Math.round(
                    number / 1000
                  )}rb`;
                }

                return `Rp${number}`;
              }}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Pendapatan"
              stroke="#bd8b36"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}