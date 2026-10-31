import {
  LayoutDashboard,
  MessageSquareText,
  MessagesSquare,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { AdminSection } from "./adminTypes";

const navigation: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "moderation", label: "Messages", icon: MessageSquareText },
  { id: "channels", label: "Channels", icon: MessagesSquare },
  { id: "settings", label: "Chat settings", icon: Settings },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  isOpen: boolean;
  onNavigate: (section: AdminSection) => void;
  onClose: () => void;
}

export default function AdminSidebar({
  activeSection,
  isOpen,
  onNavigate,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          aria-label="Close admin navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-65 flex-col border-r border-[#292929] bg-[#141414] transition-transform md:static md:z-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center gap-3 border-b border-[#292929] px-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#342318] text-[#ff994f]">
            <ShieldCheck size={19} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-xs font-semibold tracking-wide">Tech Flareconcept</p>
            <p className="m-0 mt-1 text-[10px] text-[#888]">Community workspace</p>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#888] hover:bg-[#242424] md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-2 px-2 text-[9px] font-bold tracking-[1.4px] text-[#777]">ADMIN WORKSPACE</p>
          <nav aria-label="Admin navigation" className="space-y-1">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => onNavigate(id)}
                aria-current={activeSection === id ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                  activeSection === id
                    ? "bg-[#302219] font-medium text-[#ff994f]"
                    : "text-[#aaa] hover:bg-[#202020] hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {id === "moderation" && (
                  <span className="rounded-full bg-[#242424] px-2 py-0.5 text-[9px] text-[#aaa]">
                    Review
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#292929] p-4">
          <div className="flex items-center gap-2 rounded-lg bg-[#1c1c1c] px-3 py-2.5">
            <Users size={15} className="text-[#ff994f]" />
            <div>
              <p className="m-0 text-[10px] font-medium">Local demo</p>
              <p className="m-0 mt-0.5 text-[9px] text-[#888]">Changes stay in this browser</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
