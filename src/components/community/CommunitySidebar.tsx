import {
  ChevronDown,
  LogOut,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import { isAdminEmail, type User } from "../../context/AuthContext";
import type { CommunityRoom, CommunityView } from "./communityTypes";
import { getInitials } from "./communityTypes";

const logo = new URL("../../assets/logo.jpeg", import.meta.url).href;

interface CommunitySidebarProps {
  user: User | null;
  userName: string;
  nameDraft: string;
  rooms: CommunityRoom[];
  activeView: CommunityView;
  activeRoomId: string;
  searchQuery: string;
  isOpen: boolean;
  showProfile: boolean;
  onSelectView: (view: CommunityView) => void;
  onOpenRoom: (room: CommunityRoom) => void;
  onToggleProfile: () => void;
  onNameDraftChange: (value: string) => void;
  onSaveName: () => void;
  onSignOut: () => void;
  onAdmin: () => void;
  onNotification: (message: string) => void;
  onClose: () => void;
}

export default function CommunitySidebar({
  user,
  userName,
  nameDraft,
  rooms,
  activeView,
  activeRoomId,
  searchQuery,
  isOpen,
  showProfile,
  onSelectView,
  onOpenRoom,
  onToggleProfile,
  onNameDraftChange,
  onSaveName,
  onSignOut,
  onAdmin,
  onNotification,
  onClose,
}: CommunitySidebarProps) {
  const search = searchQuery.trim().toLowerCase();
  const matchesSearch = (room: CommunityRoom) =>
    !search ||
    room.name.toLowerCase().includes(search) ||
    room.description.toLowerCase().includes(search);

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img src={logo} alt="Tech Flareconcept Academy Logo" className="h-12 w-auto" />
          <div className="brand-copy">
            <strong>TECH FLARECONCEPT</strong>
            <span> ACADEMY</span>
          </div>
          <button className="icon-btn mobile-close" onClick={onClose} aria-label="Close navigation menu">
            <X size={18} />
          </button>
        </div>

        <button
          className="workspace-switch"
          onClick={() => onNotification("You're in the Tech Flareconcept Academy demo community.")}
        >
          <div className="workspace-logo">TF</div>
          <div className="workspace-text">
            <strong>Student Community</strong>
            <span>Academy workspace</span>
          </div>
          <ChevronDown size={16} className="muted-icon" />
        </button>

        <div className="sidebar-scroll">
          <div className="nav-label">WORKSPACE</div>
          <button
            className={`nav-item ${activeView === "community" ? "active" : ""}`}
            onClick={() => onSelectView("community")}
          >
            <MessagesSquare size={18} /><span>Community chat</span><span className="nav-count">6</span>
          </button>
          <button
            className={`nav-item ${activeView === "direct" ? "active" : ""}`}
            onClick={() => onSelectView("direct")}
          >
            <MessageCircle size={18} /><span>Direct messages</span><span className="nav-count">3</span>
          </button>
          <button
            className={`nav-item ${activeView === "announcements" ? "active" : ""}`}
            onClick={() => onSelectView("announcements")}
          >
            <Megaphone size={18} /><span>Announcements</span>
          </button>
          <button
            className={`nav-item ${activeView === "members" ? "active" : ""}`}
            onClick={() => onSelectView("members")}
          >
            <Users size={18} /><span>Student directory</span>
          </button>
          {isAdminEmail(user?.email) && (
            <button className="nav-item" onClick={onAdmin}>
              <Settings size={18} /><span>Admin controls</span>
            </button>
          )}

          <div className="channel-heading">
            <span>COURSE CHANNELS</span>
            <button
              className="tiny-icon"
              onClick={() => onNotification("Create channels from the admin controls.")}
              aria-label="Add channel"
            >
              <Plus size={16} />
            </button>
          </div>
          {rooms.filter((room) => room.type === "group" && matchesSearch(room)).map((room) => (
            <button
              key={room.id}
              className={`channel-item ${activeRoomId === room.id ? "selected" : ""}`}
              onClick={() => onOpenRoom(room)}
            >
              <span className="hash"></span><span className="channel-name">{room.name}</span>
            </button>
          ))}

          <div className="channel-heading direct-heading">
            <span>DIRECT MESSAGES</span>
            <button className="tiny-icon" onClick={() => onSelectView("members")} aria-label="Start direct message">
              <Plus size={16} />
            </button>
          </div>
          {rooms.filter((room) => room.type === "direct" && matchesSearch(room)).map((room) => (
            <button
              key={room.id}
              className={`dm-item ${activeRoomId === room.id ? "selected" : ""}`}
              onClick={() => onOpenRoom(room)}
            >
              <span className={`avatar avatar-small ${room.name === "Academy Founder" ? "avatar-orange" : ""}`}>
                {room.icon}
              </span>
              <span className="dm-name">{room.name}</span>
              {room.online && <i className="online-dot" />}
            </button>
          ))}
        </div>

        <button className="user-profile" onClick={onToggleProfile}>
          <div className="avatar avatar-orange">{getInitials(userName)}</div>
          <div className="user-info">
            <strong>{userName}</strong>
            <span>Student account · Demo</span>
          </div>
          <MoreHorizontal size={18} className="muted-icon" />
        </button>

        {showProfile && (
          <div className="profile-popover">
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              value={nameDraft}
              onChange={(event) => onNameDraftChange(event.target.value)}
              maxLength={36}
            />
            <button className="btn btn-primary btn-full" onClick={onSaveName}>Save name</button>
            <button className="text-btn" onClick={onSignOut}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </aside>
      {isOpen && (
        <button className="mobile-scrim" onClick={onClose} aria-label="Close navigation overlay" />
      )}
    </>
  );
}
