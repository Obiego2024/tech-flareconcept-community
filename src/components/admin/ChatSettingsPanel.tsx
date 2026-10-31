import { MessageCircle, MessagesSquare, Send } from "lucide-react";
import type { ChatSettings } from "../../chatData";

const settings: {
  key: keyof ChatSettings;
  title: string;
  description: string;
  icon: typeof MessagesSquare;
}[] = [
  {
    key: "chatEnabled",
    title: "Enable community chat",
    description: "Pause or reopen all conversations across the workspace.",
    icon: MessagesSquare,
  },
  {
    key: "memberPostingEnabled",
    title: "Allow members to post",
    description: "Turn off member posting while keeping chat history available.",
    icon: Send,
  },
  {
    key: "directMessagesEnabled",
    title: "Allow direct messages",
    description: "Let members send messages in private conversations.",
    icon: MessageCircle,
  },
];

interface ChatSettingsPanelProps {
  value: ChatSettings;
  onChange: (key: keyof ChatSettings) => void;
}

export default function ChatSettingsPanel({ value, onChange }: ChatSettingsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
      <div className="border-b border-[#292929] px-5 py-4">
        <h2 className="m-0 text-sm font-semibold">Participation controls</h2>
        <p className="mb-0 mt-1 text-[11px] leading-5 text-[#888]">
          These preferences are saved in this browser and checked by the community chat.
        </p>
      </div>
      <div className="divide-y divide-[#292929]">
        {settings.map(({ key, title, description, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#222] text-[#ff994f] sm:grid">
                <Icon size={16} />
              </div>
              <div>
                <h3 className="m-0 text-xs font-medium">{title}</h3>
                <p className="mb-0 mt-1 text-[10px] leading-4 text-[#888]">{description}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value[key]}
              aria-label={title}
              onClick={() => onChange(key)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                value[key] ? "bg-[#f47b20]" : "bg-[#444]"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  value[key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
