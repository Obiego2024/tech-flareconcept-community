import { ArrowLeft, LogOut, Menu, Search } from "lucide-react";
import type { AdminSection } from "./adminTypes";

const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Monitor your community chat at a glance." },
  moderation: { title: "Message moderation", subtitle: "Review and remove messages from community channels." },
  channels: { title: "Channel management", subtitle: "Create and organize community chat channels." },
  settings: { title: "Chat settings", subtitle: "Control who can participate in community chat." },
};

interface AdminHeaderProps {
  activeSection: AdminSection;
  userName: string;
  onBack: () => void;
  onSignOut: () => void;
  onMenu: () => void;
}

export default function AdminHeader({
  activeSection,
  userName,
  onBack,
  onSignOut,
  onMenu,
}: AdminHeaderProps) {
  const { title, subtitle } = sectionTitles[activeSection];
  return (
    <header className="flex min-h-18 items-center justify-between gap-4 border-b border-[#292929] bg-[#121212] px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#aaa] hover:bg-[#252525] md:hidden"
          onClick={onMenu}
          aria-label="Open admin navigation"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <div className="mb-1 hidden items-center gap-1.5 text-[9px] font-semibold tracking-wider text-[#777] sm:flex">
            <Search size={11} /> ADMIN / {title.toUpperCase()}
          </div>
          <h1 className="m-0 truncate font-['Space_Grotesk'] text-base font-semibold sm:text-lg">{title}</h1>
          <p className="m-0 mt-0.5 hidden truncate text-[10px] text-[#888] sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="m-0 text-[11px] font-medium">{userName}</p>
          <p className="m-0 mt-0.5 text-[9px] text-[#888]">Administrator</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to community chat"
          title="Back to community"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#343434] text-[#bbb] hover:border-[#ff7a1a] hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-9 items-center gap-2 rounded-lg border border-[#343434] px-2.5 text-[10px] text-[#bbb] hover:border-[#673329] hover:text-[#ff9c8b] sm:px-3"
        >
          <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
