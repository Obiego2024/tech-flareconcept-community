import React, { useState } from "react";
import { 
  MessageCircle, 
  MessagesSquare, 
  Send, 
  Code, 
  Server, 
  ShieldCheck, 
  BarChart3, 
  Plus, 
  Hash 
} from "lucide-react";
import type { ChatSettings } from "../../chatData";

interface ChatSettingsPanelProps {
  value: ChatSettings;
  onChange: (key: keyof ChatSettings) => void;
  onToggleCustomChannel?: (channelId: string) => void;
  onAddCustomChannel?: (channelName: string) => void;
}

const globalSettingsConfig: {
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

const trackSettingsConfig: {
  key: keyof ChatSettings;
  title: string;
  description: string;
  icon: typeof Code;
}[] = [
  {
    key: "frontendChatEnabled" as keyof ChatSettings,
    title: "Frontend Development Chat",
    description: "Enable chat channel for Frontend discussions.",
    icon: Code,
  },
  {
    key: "backendChatEnabled" as keyof ChatSettings,
    title: "Backend Development Chat",
    description: "Enable chat channel for Backend discussions.",
    icon: Server,
  },
  {
    key: "cybersecurityChatEnabled" as keyof ChatSettings,
    title: "Cybersecurity Chat",
    description: "Enable chat channel for Cybersecurity discussions.",
    icon: ShieldCheck,
  },
  {
    key: "dataAnalyticsChatEnabled" as keyof ChatSettings,
    title: "Data Analytics Chat",
    description: "Enable chat channel for Data Analytics discussions.",
    icon: BarChart3,
  },
];

export default function ChatSettingsPanel({
  value,
  onChange,
  onToggleCustomChannel,
  onAddCustomChannel,
}: ChatSettingsPanelProps) {
  const [newChannelName, setNewChannelName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const customChannels = (
    value as ChatSettings & { customChannels?: Record<string, boolean> }
  ).customChannels;

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    
    if (onAddCustomChannel) {
      onAddCustomChannel(newChannelName.trim());
    }
    setNewChannelName("");
    setShowAddInput(false);
  };

  const renderToggle = (isEnabled: boolean, onClick: () => void, title: string) => (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      aria-label={title}
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/50 ${
        isEnabled ? "bg-[#f47b20]" : "bg-[#444]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          isEnabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
      {/* Global Controls */}
      <div className="border-b border-[#292929] px-5 py-4">
        <h2 className="m-0 text-sm font-semibold text-white">Participation Controls</h2>
        <p className="mb-0 mt-0.5 text-xs text-[#888]">
          These preferences control permissions and visibility across the workspace.
        </p>
      </div>

      <div className="divide-y divide-[#292929]">
        {globalSettingsConfig.map(({ key, title, description, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#222] text-[#ff994f] sm:grid">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="m-0 text-xs font-medium text-white">{title}</h3>
                <p className="mb-0 mt-0.5 text-xs text-[#888]">{description}</p>
              </div>
            </div>
            {renderToggle(Boolean(value[key]), () => onChange(key), title)}
          </div>
        ))}
      </div>

      {/* Track Channels */}
      <div className="border-b border-t border-[#292929] bg-[#121212] px-5 py-3">
        <h3 className="m-0 text-xs font-semibold uppercase tracking-wider text-[#aaa]">
          Track Channels
        </h3>
      </div>

      <div className="divide-y divide-[#292929]">
        {trackSettingsConfig.map(({ key, title, description, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#222] text-[#ff994f] sm:grid">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="m-0 text-xs font-medium text-white">{title}</h3>
                <p className="mb-0 mt-0.5 text-xs text-[#888]">{description}</p>
              </div>
            </div>
            {renderToggle(Boolean(value[key]), () => onChange(key), title)}
          </div>
        ))}

        {/* Custom Channels Added Dynamically */}
        {customChannels &&
          Object.entries(customChannels).map(([channelId, isEnabled]) => (
            <div
              key={channelId}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#222] text-[#ff994f] sm:grid">
                  <Hash size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="m-0 text-xs font-medium text-white">{channelId} Chat</h3>
                  <p className="mb-0 mt-0.5 text-xs text-[#888]">
                    Custom community channel.
                  </p>
                </div>
              </div>
              {renderToggle(
                Boolean(isEnabled),
                () => onToggleCustomChannel?.(channelId),
                `${channelId} Chat`
              )}
            </div>
          ))}
      </div>

      {/* Add Custom Channel Action */}
      <div className="border-t border-[#292929] bg-[#141414] px-5 py-4">
        {showAddInput ? (
          <form onSubmit={handleAddChannel} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Mobile Development"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-[#333] bg-[#222] px-3 py-1.5 text-xs text-white placeholder-[#666] focus:border-[#f47b20] focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[#f47b20] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#ff994f]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddInput(false)}
              className="shrink-0 rounded-lg bg-[#222] px-3 py-1.5 text-xs font-medium text-[#aaa] transition-colors hover:bg-[#333]"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-2 text-xs font-medium text-[#ff994f] transition-colors hover:text-[#f47b20]"
          >
            <Plus size={16} /> Add Custom Channel
          </button>
        )}
      </div>
    </section>
  );
}