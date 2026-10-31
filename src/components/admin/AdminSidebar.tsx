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
const logo = new URL("../../assets/logo-removebg-preview (1).png", import.meta.url).href;

const navigation: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "moderation", label: "Messages", icon: MessageSquareText },
  { id: "channels", label: "Channels", icon: MessagesSquare },
  { id: "settings", label: "Chat Settings", icon: Settings },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  isOpen: boolean;
  onNavigate: (section: AdminSection) => void;
  onClose: () => void;
}

/**
 * AdminSidebar renders the desktop sidebar and mobile drawer navigation
 * for switching between administrative sections.
 */
export default function AdminSidebar({
  activeSection,
  isOpen,
  onNavigate,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#292929] bg-[#141414] transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-[#292929] px-5">
          <img src={logo} alt="Tech Flareconcept Logo" className="h-8 w-auto" />
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-xs font-semibold tracking-wide text-white">Tech Flareconcept</p>
            <p className="m-0 mt-0.5 text-[10px] text-[#888]">Community Workspace</p>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#888] transition-colors duration-200 hover:bg-[#242424] hover:text-white md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-6">
          <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-[#777]">ADMIN WORKSPACE</p>
          <nav aria-label="Admin navigation" className="space-y-1">
            {navigation.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => onNavigate(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#302219] text-[#ff994f]"
                      : "text-[#aaa] hover:bg-[#202020] hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{label}</span>
                  {id === "moderation" && (
                    <span className="rounded-full bg-[#242424] px-2 py-0.5 text-[10px] font-normal text-[#aaa]">
                      Review
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Box */}
        <div className="mt-auto border-t border-[#292929] p-4">
          <div className="flex items-center gap-2.5 rounded-lg bg-[#1c1c1c] px-3 py-2.5 border border-[#262626]">
            <Users size={16} className="text-[#ff994f]" />
            <div className="min-w-0">
              <p className="m-0 text-xs font-medium text-white">Local Demo</p>
              <p className="m-0 mt-0.5 text-[10px] text-[#888]">Changes stay in this browser</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}