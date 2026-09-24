import StatCard from "./StatCard";

import {
  MONTHS,
} from "./config";

import {
  formatRupiah,
} from "./helper";

type ReportStatsProps = {
  totalYearRevenue: number;
  currentMonthRevenue: number;
  averageOccupancy: number;
  activeTenantCount: number;
  currentYear: number;
  currentMonth: number;
};

export default function ReportStats({
  totalYearRevenue,
  currentMonthRevenue,
  averageOccupancy,
  activeTenantCount,
  currentYear,
  currentMonth,
}: ReportStatsProps) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Pendapatan Tahun Ini"
        value={formatRupiah(
          totalYearRevenue
        )}
        subtitle={`Tahun ${currentYear}`}
      />

      <StatCard
        title="Pendapatan Bulan Ini"
        value={formatRupiah(
          currentMonthRevenue
        )}
        subtitle={
          MONTHS[currentMonth]
        }
      />

      <StatCard
        title="Rata-rata Okupansi"
        value={`${averageOccupancy}%`}
        subtitle="Berdasarkan laporan"
      />

      <StatCard
        title="Penyewa Aktif"
        value={String(
          activeTenantCount
        )}
        subtitle="Penyewa aktif"
      />
    </div>
  );
}