import { GraduationCap } from "lucide-react";

export default function Brand() {
  return (
    <div className="mb-7 flex items-center justify-center gap-3 border-0 p-0 sm:mb-8">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-orange-300 to-orange-600 text-zinc-950 shadow-lg shadow-orange-500/10">
        <GraduationCap size={24} />
      </div>
      <div className="flex flex-col gap-0.5">
        <strong className="font-[Space_Grotesk] text-sm tracking-[1.1px] text-white">TECH FLARE</strong>
        <span className="text-[9px] tracking-[2px] text-zinc-400">CONCEPT ACADEMY</span>
      </div>
    </div>
  );
}
