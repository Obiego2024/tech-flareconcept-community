import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ChatMessage } from "../../chatData";

const ROOM_NAMES: Record<string, string> = {
  general: "#general-chat",
  frontend: "#frontend-dev",
  backend: "#backend-dev",
  cyber: "#cybersecurity",
  data: "#data-analytics",
  projects: "#project-showcase",
  announcements: "#academy-announcements",
  "dm-amara": "Amara Okafor",
  "dm-david": "David James",
  "dm-founder": "Academy Founder",
};

interface MessageModerationPanelProps {
  messages: ChatMessage[];
  onRemove: (id: string) => void;
}

/**
 * MessageModerationPanel renders the search and review interface for 
 * monitoring, searching, and moderating community chat messages.
 */
export default function MessageModerationPanel({
  messages,
  onRemove,
}: MessageModerationPanelProps) {
  const [query, setQuery] = useState("");
  
  const filteredMessages = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...messages]
      .filter((message) =>
        !search ||
        message.text.toLowerCase().includes(search) ||
        message.sender.toLowerCase().includes(search) ||
        message.attachment?.name.toLowerCase().includes(search) ||
        (ROOM_NAMES[message.roomId] ?? message.roomId).toLowerCase().includes(search)
      )
      .reverse();
  }, [messages, query]);

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292929] px-5 py-4">
        <div>
          <h2 className="m-0 text-sm font-semibold text-white">Community messages</h2>
          <p className="mb-0 mt-0.5 text-xs text-[#888]">Search by sender, channel, or message text.</p>
        </div>
        <span className="rounded-full bg-[#242424] px-2.5 py-1 text-xs text-[#aaa]">
          {filteredMessages.length} shown
        </span>
      </div>

      {/* Search Input */}
      <div className="px-5 pt-4">
        <label className="flex max-w-sm items-center gap-2.5 rounded-lg border border-[#343434] bg-[#111] px-3 py-2 text-[#777] transition-colors duration-200 focus-within:border-[#ff7a1a]">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages..."
            aria-label="Search messages"
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#666]"
          />
        </label>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <p className="px-5 py-12 text-center text-xs text-[#888]">
          {messages.length === 0 ? "There are no messages to review." : "No messages match your search."}
        </p>
      ) : (
        <ul className="m-0 mt-3 divide-y divide-[#292929] p-0">
          {filteredMessages.map((message) => (
            <li 
              key={message.id} 
              className="flex items-start gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#28333a] text-xs font-bold text-[#b6e5f3]">
                {message.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <strong className="text-xs font-medium text-white">{message.sender}</strong>
                  <span className="text-[10px] text-[#777]">{message.time}</span>
                  <span className="rounded bg-[#242424] px-2 py-0.5 text-[10px] font-normal text-[#999]">
                    {ROOM_NAMES[message.roomId] ?? message.roomId}
                  </span>
                </div>
                <p className="m-0 wrap-break-word text-xs leading-relaxed text-[#bbb]">{message.text}</p>
                {message.attachment && (
                  <p className="mb-0 mt-1 text-[10px] text-[#8b5cf6]">
                    Attachment: {message.attachment.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Remove message from ${message.sender}`}
                title="Remove message"
                onClick={() => onRemove(message.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#888] transition-colors duration-200 hover:bg-[#35211a] hover:text-[#ff994f]"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}