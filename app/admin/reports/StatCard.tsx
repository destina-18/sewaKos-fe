type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="relative rounded-[10px] bg-white px-5 py-5 shadow-sm">
      <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#c8953e]" />

      <p className="text-[10px] text-[#888]">
        {title}
      </p>

      <p className="mt-2 font-serif text-[22px] font-bold leading-none text-[#29354a]">
        {value}
      </p>

      <p className="mt-2 text-[8px] text-[#999]">
        {subtitle}
      </p>
    </div>
  );
}