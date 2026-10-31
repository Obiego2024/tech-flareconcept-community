import { Hash, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ChatRoom } from "../../chatData";

interface ChannelManagementPanelProps {
  rooms: ChatRoom[];
  onAdd: (name: string, description: string) => string | null;
  onRemove: (roomId: string) => void;
}

/**
 * ChannelManagementPanel renders the interface for viewing course channels,
 * creating new channels, and deleting existing ones.
 */
export default function ChannelManagementPanel({
  rooms,
  onAdd,
  onRemove,
}: ChannelManagementPanelProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const channels = rooms.filter((room) => room.type === "group");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onAdd(name, description);
    if (result) {
      setError(result);
      return;
    }
    setName("");
    setDescription("");
    setError("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
      {/* Channels List Section */}
      <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
        <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4">
          <div>
            <h2 className="m-0 text-sm font-semibold text-white">Course channels</h2>
            <p className="mb-0 mt-0.5 text-xs text-[#888]">Channels appear in the community sidebar.</p>
          </div>
          <span className="rounded-full bg-[#242424] px-2.5 py-1 text-xs text-[#aaa]">
            {channels.length} total
          </span>
        </div>

        {channels.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-[#888]">
            No course channels yet. Add one to get started.
          </p>
        ) : (
          <ul className="m-0 divide-y divide-[#292929] p-0">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className="flex items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-[#1a1a1a]"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#29221b] text-[#ff994f]">
                  <Hash size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-medium text-white">{channel.name}</p>
                  <p className="m-0 mt-0.5 truncate text-xs text-[#888]">{channel.description}</p>
                </div>
                <span className="hidden text-xs text-[#777] sm:block">{channel.members} members</span>
                <button
                  type="button"
                  aria-label={`Delete ${channel.name}`}
                  title={`Delete ${channel.name}`}
                  onClick={() => onRemove(channel.id)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#888] transition-colors duration-200 hover:bg-[#35211a] hover:text-[#ff994f]"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Create Channel Form Section */}
      <section className="h-fit rounded-xl border border-[#292929] bg-[#161616] p-5">
        <h2 className="m-0 text-sm font-semibold text-white">Create a channel</h2>
        <p className="mb-4 mt-0.5 text-xs leading-relaxed text-[#888]">
          Add a space for a course, study group, or project.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-medium text-[#aaa]">
            Channel name
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#343434] bg-[#111] px-3 transition-colors duration-200 focus-within:border-[#ff7a1a]">
              <span className="text-sm text-[#888]">#</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={32}
                placeholder="e.g. ui-design"
                className="h-10 w-full bg-transparent text-xs text-white outline-none placeholder:text-[#666]"
              />
            </div>
          </label>

          <label className="block text-xs font-medium text-[#aaa]">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={120}
              rows={3}
              placeholder="What is this channel for?"
              className="mt-1.5 w-full resize-y rounded-lg border border-[#343434] bg-[#111] p-3 text-xs text-white outline-none transition-colors duration-200 placeholder:text-[#666] focus:border-[#ff7a1a]"
            />
          </label>

          {error && (
            <p role="alert" className="m-0 text-xs font-medium text-[#ff9c8b]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f47b20] text-xs font-semibold text-[#17100a] transition-colors duration-200 hover:bg-[#ff994f]"
          >
            <Plus size={16} /> Create channel
          </button>
        </form>
      </section>
    </div>
  );
}