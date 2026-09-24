type ReportHeaderProps = {
  onLogout: () => void;
};

export default function ReportHeader({
  onLogout,
}: ReportHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-[#eeeeee] bg-white px-5 md:px-8">
      <p className="text-[12px] font-medium text-[#777]">
        Laporan
      </p>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#222]">
          Admin
        </span>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#612626] text-[11px] font-bold text-white">
          A
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-[#ddd] bg-white px-3 py-1.5 text-[10px] font-medium text-[#333] transition hover:bg-[#f5f5f5]"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}