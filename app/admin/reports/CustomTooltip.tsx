import {
  formatRupiah,
} from "./helper";

export default function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const value =
    Number(
      payload[0]?.value || 0
    );

  return (
    <div className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 shadow-lg">
      <p className="text-[10px] text-[#777]">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-semibold text-[#bd8b36]">
        {formatRupiah(value)}
      </p>
    </div>
  );
}