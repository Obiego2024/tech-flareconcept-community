import {
  ArrowRight,
  MessageSquareText,
  MessagesSquare,
  ShieldAlert,
  Users,
} from "lucide-react";
import type { ChatMessage, ChatRoom, ChatSettings } from "../../chatData";
import AdminStatCard from "./AdminStatCard";
import type { AdminSection } from "./adminTypes";

interface AdminOverviewProps {
  messages: ChatMessage[];
  rooms: ChatRoom[];
  settings: ChatSettings;
  onNavigate: (section: AdminSection) => void;
}

/**
 * AdminOverview renders the main dashboard overview containing key metric cards,
 * recent message activity, and quick navigation shortcuts for administrators.
 */
export default function AdminOverview({
  messages,
  rooms,
  settings,
  onNavigate,
}: AdminOverviewProps) {
  const channelCount = rooms.filter((room) => room.type === "group").length;
  const directMessageCount = messages.filter((message) => message.roomId.startsWith("dm-")).length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <AdminStatCard label="Total messages" value={messages.length} helper="Stored in this browser" icon={MessageSquareText} />
        <AdminStatCard label="Course channels" value={channelCount} helper="Group chat spaces" icon={MessagesSquare} tone="blue" />
        <AdminStatCard label="Direct messages" value={directMessageCount} helper="Private conversation messages" icon={Users} tone="green" />
        <AdminStatCard
          label="Chat status"
          value={settings.chatEnabled ? "Active" : "Paused"}
          helper={settings.chatEnabled ? "Members can access chat" : "Chat is currently unavailable"}
          icon={ShieldAlert}
          tone={settings.chatEnabled ? "green" : "orange"}
        />
      </div>

      {/* Main Content Layout: Recent Messages & Quick Actions */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
        {/* Recent Messages Section */}
        <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
          <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4">
            <div>
              <h2 className="m-0 text-sm font-semibold text-white">Recent messages</h2>
              <p className="mb-0 mt-0.5 text-xs text-[#888]">Latest activity across the workspace.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("moderation")}
              className="flex items-center gap-1.5 text-xs font-medium text-[#ff994f] transition-colors duration-200 hover:text-white"
            >
              Review all <ArrowRight size={14} />
            </button>
          </div>

          {messages.length === 0 ? (
            <p className="px-5 py-10 text-center text-xs text-[#888]">No chat activity yet.</p>
          ) : (
            <ul className="m-0 divide-y divide-[#292929] p-0">
              {[...messages].reverse().slice(0, 5).map((message) => (
                <li key={message.id} className="flex items-start gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#28333a] text-xs font-bold text-[#b6e5f3]">
                    {message.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2">
                      <strong className="text-xs font-medium text-white">{message.sender}</strong>
                      <span className="text-[10px] text-[#777]">{message.time}</span>
                    </div>
                    <p className="m-0 truncate text-xs text-[#aaa]">{message.text}</p>
                  </div>
                  <span className="hidden max-w-32 truncate rounded bg-[#242424] px-2 py-1 text-[10px] text-[#999] sm:block">
                    {rooms.find((room) => room.id === message.roomId)?.name ?? message.roomId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick Actions Section */}
        <section className="rounded-xl border border-[#292929] bg-[#161616] p-5">
          <h2 className="m-0 text-sm font-semibold text-white">Quick actions</h2>
          <p className="mb-4 mt-0.5 text-xs text-[#888]">Manage your community in a few clicks.</p>
          
          <div className="space-y-2.5">
            {[
              { title: "Manage students", text: "Review accounts and access", section: "students" as const, icon: Users },
              { title: "Review messages", text: "Search and remove messages", section: "moderation" as const, icon: MessageSquareText },
              { title: "Manage channels", text: "Create or remove a channel", section: "channels" as const, icon: MessagesSquare },
              { title: "Update chat settings", text: "Control chat participation", section: "settings" as const, icon: ShieldAlert },
            ].map(({ title, text, section, icon: Icon }) => (
              <button
                type="button"
                key={section}
                onClick={() => onNavigate(section)}
                className="flex w-full items-center gap-3.5 rounded-lg border border-[#292929] bg-[#131313] p-3 text-left transition-colors duration-200 hover:border-[#ff7a1a]/50 hover:bg-[#1c1916]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#2c2118] text-[#ff994f]">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-xs font-medium text-white">{title}</strong>
                  <span className="mt-0.5 block text-[11px] text-[#888]">{text}</span>
                </span>
                <ArrowRight size={15} className="text-[#777]" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}