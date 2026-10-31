import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: "orange" | "green" | "blue";
}

const tones = {
  orange: "bg-[#342318] text-[#ff994f]",
  green: "bg-[#1e3026] text-[#79d99c]",
  blue: "bg-[#202b36] text-[#8fc8ef]",
};

/**
 * AdminStatCard displays a single metric with a label, value, description,
 * and a styled icon badge for the admin dashboard overview.
 */
export default function AdminStatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "orange",
}: AdminStatCardProps) {
  return (
    <article className="rounded-xl border border-[#292929] bg-[#161616] p-4 sm:p-5 transition-colors duration-200 hover:border-[#383838]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-[#999]">{label}</p>
          <strong className="mt-2 block font-['Space_Grotesk'] text-2xl font-semibold text-white">
            {value}
          </strong>
        </div>
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="m-0 mt-3 text-[11px] text-[#777]">{helper}</p>
    </article>
  );
}