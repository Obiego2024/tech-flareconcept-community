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
  
  // Helper to determine the header breadcrumb title
  const getBreadcrumbTitle = () => {
    return activeView === "members" ? "Students" : currentRoom.name;
  };

  // Helper to determine search placeholder text
  const getSearchPlaceholder = () => {
    return activeView === "members" ? "Search students..." : "Search channels...";
  };

  return (
    <header className="topbar" aria-label="Community Header">
      {/* Left Navigation & Breadcrumbs */}
      <div className="topbar-left">
        <button 
          type="button" 
          className="icon-btn mobile-menu" 
          onClick={onOpenMenu} 
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="crumb">
          <span>Community</span>
          <span className="crumb-slash" aria-hidden="true">/</span>
          <strong>{getBreadcrumbTitle()}</strong>
        </div>
      </div>

      {/* Right Actions & Utilities */}
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={getSearchPlaceholder()}
            aria-label={getSearchPlaceholder()}
          />
          <kbd aria-hidden="true">⌘ K</kbd>
        </label>

        <button
          type="button"
          className="icon-btn notification-btn"
          aria-label="View notifications"
          onClick={() => onNotification("You're all caught up!")}
        >
          <Bell size={19} />
          <i aria-hidden="true" />
        </button>

        <div 
          className="top-avatar" 
          title={userName} 
          aria-label={`User avatar for ${userName}`}
        >
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}