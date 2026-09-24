import {
  formatRupiah,
} from "./helper";

type ReportSummaryProps = {
  totalYearRevenue: number;
  currentMonthRevenue: number;
  averageOccupancy: number;
  activeTenantCount: number;
  emptyRoomCount: number;
};

export default function ReportSummary({
  totalYearRevenue,
  currentMonthRevenue,
  averageOccupancy,
  activeTenantCount,
  emptyRoomCount,
}: ReportSummaryProps) {
  return (
    <section className="rounded-[10px] bg-white p-5 shadow-sm">
      <h2 className="font-serif text-[13px] font-bold text-[#29354a]">
        Ringkasan
      </h2>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <span className="text-[9px] text-[#777]">
            Pendapatan tahun ini
          </span>

          <span className="text-[9px] font-semibold text-[#444]">
            {formatRupiah(
              totalYearRevenue
            )}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <span className="text-[9px] text-[#777]">
            Pendapatan bulan ini
          </span>

          <span className="text-[9px] font-semibold text-[#444]">
            {formatRupiah(
              currentMonthRevenue
            )}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <span className="text-[9px] text-[#777]">
            Rata-rata okupansi
          </span>

          <span className="text-[9px] font-semibold text-[#444]">
            {averageOccupancy}%
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <span className="text-[9px] text-[#777]">
            Penyewa aktif
          </span>

          <span className="text-[9px] font-semibold text-[#444]">
            {activeTenantCount} orang
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#777]">
            Kamar kosong
          </span>

          <span className="text-[9px] font-semibold text-[#444]">
            {emptyRoomCount} kamar
          </span>
        </div>
      </div>
    </section>
  );
}