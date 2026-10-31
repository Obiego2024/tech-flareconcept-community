import { ArrowLeft, LogOut, Menu, Shield } from "lucide-react";
import type { AdminSection } from "./adminTypes";

const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Monitor your community chat at a glance." },
  students: { title: "Student Management", subtitle: "Review student accounts and manage access permissions." },
  moderation: { title: "Message Moderation", subtitle: "Review and remove messages from community channels." },
  channels: { title: "Channel Management", subtitle: "Create and organize community chat channels." },
  settings: { title: "Chat Settings", subtitle: "Control participant permissions and community rules." },
};

interface AdminHeaderProps {
  activeSection: AdminSection;
  userName: string;
  onBack: () => void;
  onSignOut: () => void;
  onMenu: () => void;
}

/**
 * AdminHeader renders the top navigation bar for the administrative dashboard,
 * displaying current section details, user profile info, and quick actions.
 */
export default function AdminHeader({
  activeSection,
  userName,
  onBack,
  onSignOut,
  onMenu,
}: AdminHeaderProps) {
  const { title, subtitle } = sectionTitles[activeSection];

  return (
    <header className="flex h-16 min-h-16 items-center justify-between gap-4 border-b border-[#292929] bg-[#121212] px-4 sm:px-7">
      {/* Left Section: Mobile Menu & Breadcrumb / Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#aaa] transition-colors duration-200 hover:bg-[#252525] hover:text-white md:hidden"
          onClick={onMenu}
          aria-label="Open admin navigation menu"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <div className="mb-0.5 hidden items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#777] sm:flex">
            <Shield size={12} className="text-[#ff7a1a]" /> ADMIN / {title.toUpperCase()}
          </div>
          <h1 className="m-0 truncate font-['Space_Grotesk'] text-base font-semibold text-white sm:text-lg">
            {title}
          </h1>
          <p className="m-0 hidden truncate text-xs text-[#888] sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right Section: User Info & Actions */}
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="m-0 text-xs font-medium text-white">{userName}</p>
          <p className="m-0 mt-0.5 text-[10px] text-[#888]">Administrator</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          aria-label="Return to community chat"
          title="Return to community"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#343434] text-[#bbb] transition-colors duration-200 hover:border-[#ff7a1a] hover:bg-[#1a1a1a] hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="flex h-9 items-center gap-2 rounded-lg border border-[#343434] px-2.5 text-xs text-[#bbb] transition-colors duration-200 hover:border-[#673329] hover:bg-[#1f1614] hover:text-[#ff9c8b] sm:px-3"
        >
          <LogOut size={14} /> 
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}