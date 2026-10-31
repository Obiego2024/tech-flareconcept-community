import { Bell, Menu, Search } from "lucide-react";
import type { CommunityRoom, CommunityView } from "./communityTypes";
import { getInitials } from "./communityTypes";

interface CommunityHeaderProps {
  userName: string;
  activeView: CommunityView;
  currentRoom: CommunityRoom;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNotification: (message: string) => void;
  onOpenMenu: () => void;
}

export default function CommunityHeader({
  userName,
  activeView,
  currentRoom,
  searchQuery,
  onSearchChange,
  onNotification,
  onOpenMenu,
}: CommunityHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn mobile-menu" onClick={onOpenMenu} aria-label="Open navigation menu">
          <Menu size={20} />
        </button>
        <div className="crumb">
          <span>Community</span>
          <span className="crumb-slash">/</span>
          <strong>{activeView === "members" ? "Students" : currentRoom.name}</strong>
        </div>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={16} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={activeView === "members" ? "Search students..." : "Search channels..."}
            aria-label={activeView === "members" ? "Search students" : "Search channels"}
          />
          <kbd>⌘ K</kbd>
        </label>
        <button
          className="icon-btn notification-btn"
          aria-label="Notifications"
          onClick={() => onNotification("You're all caught up!")}
        >
          <Bell size={19} /><i />
        </button>
        <div className="top-avatar">{getInitials(userName)}</div>
      </div>
    </header>
  );
}
