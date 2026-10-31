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

export default function AdminOverview({
  messages,
  rooms,
  settings,
  onNavigate,
}: AdminOverviewProps) {
  const channelCount = rooms.filter((room) => room.type === "group").length;
  const directMessageCount = messages.filter((message) => message.roomId.startsWith("dm-")).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(270px,.7fr)]">
        <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
          <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4">
            <div>
              <h2 className="m-0 text-sm font-semibold">Recent messages</h2>
              <p className="mb-0 mt-1 text-[10px] text-[#888]">Latest activity across the workspace.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("moderation")}
              className="flex items-center gap-1 text-[10px] text-[#ff994f] hover:text-white"
            >
              Review all <ArrowRight size={13} />
            </button>
          </div>
          {messages.length === 0 ? (
            <p className="px-5 py-9 text-center text-xs text-[#888]">No chat activity yet.</p>
          ) : (
            <ul className="m-0 divide-y divide-[#292929] p-0">
              {[...messages].reverse().slice(0, 5).map((message) => (
                <li key={message.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#28333a] text-[9px] font-bold text-[#b6e5f3]">
                    {message.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2">
                      <strong className="text-[10px]">{message.sender}</strong>
                      <span className="text-[9px] text-[#777]">{message.time}</span>
                    </div>
                    <p className="m-0 truncate text-[10px] text-[#aaa]">{message.text}</p>
                  </div>
                  <span className="hidden max-w-28 truncate rounded bg-[#242424] px-1.5 py-1 text-[9px] text-[#999] sm:block">
                    {rooms.find((room) => room.id === message.roomId)?.name ?? message.roomId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-[#292929] bg-[#161616] p-5">
          <h2 className="m-0 text-sm font-semibold">Quick actions</h2>
          <p className="mb-4 mt-1 text-[10px] text-[#888]">Manage your community in a few clicks.</p>
          <div className="space-y-2">
            {[
              { title: "Review messages", text: "Search and remove messages", section: "moderation" as const, icon: MessageSquareText },
              { title: "Manage channels", text: "Create or remove a channel", section: "channels" as const, icon: MessagesSquare },
              { title: "Update chat settings", text: "Control chat participation", section: "settings" as const, icon: ShieldAlert },
            ].map(({ title, text, section, icon: Icon }) => (
              <button
                type="button"
                key={section}
                onClick={() => onNavigate(section)}
                className="flex w-full items-center gap-3 rounded-lg border border-[#292929] bg-[#131313] p-3 text-left hover:border-[#543720] hover:bg-[#1c1916]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#2c2118] text-[#ff994f]">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[10px] font-medium">{title}</strong>
                  <span className="mt-1 block text-[9px] text-[#888]">{text}</span>
                </span>
                <ArrowRight size={14} className="text-[#777]" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
