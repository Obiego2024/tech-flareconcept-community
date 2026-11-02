import {
  ChevronDown,
  ImagePlus,
  LogOut,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import { isAdminEmail, type User } from "../../context/AuthContext";
import type { CommunityRoom, CommunityView } from "./communityTypes";
import { COMMUNITY_PEOPLE, getInitials } from "./communityTypes";

const logo = new URL("../../assets/logo-removebg-preview (1).png", import.meta.url).href;

interface CommunitySidebarProps {
  user: User | null;
  userName: string;
  profileImage: string;
  nameDraft: string;
  rooms: CommunityRoom[];
  activeView: CommunityView;
  activeRoomId: string;
  searchQuery: string;
  isOpen: boolean;
  isCollapsed: boolean;
  showProfile: boolean;
  onSelectView: (view: CommunityView) => void;
  onOpenRoom: (room: CommunityRoom) => void;
  onToggleProfile: () => void;
  onNameDraftChange: (value: string) => void;
  onSaveName: () => void;
  onProfileImageSelect: (file: File | null) => void;
  onSignOut: () => void;
  onAdmin: () => void;
  onNotification: (message: string) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  onMessage: (name: string) => void;
}

export default function CommunitySidebar({
  user,
  userName,
  profileImage,
  nameDraft,
  rooms,
  activeView,
  activeRoomId,
  searchQuery,
  isOpen,
  isCollapsed,
  showProfile,
  onSelectView,
  onOpenRoom,
  onToggleProfile,
  onNameDraftChange,
  onSaveName,
  onProfileImageSelect,
  onSignOut,
  onAdmin,
  onNotification,
  onClose,
  onToggleCollapse,
  onMessage,
}: CommunitySidebarProps) {
  
  // Search filter helper
  const search = searchQuery.trim().toLowerCase();
  const matchesSearch = (room: CommunityRoom) =>
    !search ||
    room.name.toLowerCase().includes(search) ||
    room.description.toLowerCase().includes(search);

  const groupRooms = rooms.filter((room) => room.type === "group" && matchesSearch(room));
  const directRooms = rooms.filter((room) => room.type === "direct" && matchesSearch(room));
  const filteredPeople = COMMUNITY_PEOPLE.filter(
    (person) =>
      !search ||
      person.name.toLowerCase().includes(search) ||
      person.role.toLowerCase().includes(search)
  );

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`}
        aria-label="Community Sidebar"
        style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}
      >
        {/* Brand Header (Sticky at top) */}
        <div className="brand" style={{ flexShrink: 0 }}>
          <img src={logo} alt="Tech Flareconcept Academy Logo" className="h-12 w-auto" />
          <div className="brand-copy">
            <strong>TECH FLARECONCEPT</strong>
            <span> ACADEMY</span>
          </div>
          <button 
            type="button"
            className="icon-btn mobile-close" 
            onClick={onClose} 
            aria-label="Close navigation menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn desktop-sidebar-close"
            onClick={onToggleCollapse}
            aria-label="Close community sidebar"
          >
            <PanelLeftClose size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Workspace Switcher (Sticky at top) */}
        {/* <div style={{ flexShrink: 0, padding: "0 12px" }}>
          <button
            type="button"
            className="workspace-switch"
            onClick={() => onNotification("You're in the Tech Flareconcept Academy demo community.")}
            style={{ width: "100%" }}
          >
            <div className="workspace-logo" aria-hidden="true">TF</div>
            <div className="workspace-text">
              <strong>Student Community</strong>
              <span>Academy workspace</span>
            </div>
            <ChevronDown size={16} className="muted-icon" aria-hidden="true" />
          </button>
        </div> */}

        {/* Scrollable Navigation Area (Takes remaining space and scrolls independently) */}
        <div 
          className="sidebar-scroll" 
          style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
        >
          <div className="nav-label text-2xl">WORKSPACE</div>
          
          <button
            type="button"
            className={`nav-item ${activeView === "community" ? "active" : ""}`}
            onClick={() => onSelectView("community")}
          >
            <MessagesSquare size={18} aria-hidden="true" />
            <span>Community chat</span>
            <span className="nav-count">6</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeView === "direct" ? "active" : ""}`}
            onClick={() => onSelectView("direct")}
          >
            <MessageCircle size={18} aria-hidden="true" />
            <span>Direct messages</span>
            <span className="nav-count">3</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeView === "announcements" ? "active" : ""}`}
            onClick={() => onSelectView("announcements")}
          >
            <Megaphone size={18} aria-hidden="true" />
            <span>Announcements</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeView === "members" ? "active" : ""}`}
            onClick={() => onSelectView("members")}
          >
            <Users size={18} aria-hidden="true" />
            <span>Student directory</span>
          </button>

          {activeView === "members" && (
            <section className="sidebar-people" aria-label="Community members">
              <div className="sidebar-people-heading">
                <span>COMMUNITY MEMBERS</span>
                <span>{filteredPeople.length}</span>
              </div>
              {filteredPeople.map((person) => (
                <button
                  type="button"
                  className="sidebar-person"
                  key={person.name}
                  onClick={() => onMessage(person.name)}
                  aria-label={`Message ${person.name}, ${person.online ? "online" : "offline"}`}
                >
                  <span className="avatar avatar-small" aria-hidden="true">{person.initials}</span>
                  <span className="sidebar-person-info">
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                  </span>
                  <i
                    className={`member-status-dot ${person.online ? "member-online" : "member-offline"}`}
                    aria-label={person.online ? "Online" : "Offline"}
                    title={person.online ? "Online" : "Offline"}
                  />
                </button>
              ))}
            </section>
          )}

          {/* {isAdminEmail(user?.email) && (
            <button type="button" className="nav-item" onClick={onAdmin}>
              <Settings size={18} aria-hidden="true" />
              <span>Admin controls</span>
            </button>
          )} */}

          {/* Course Channels */}
          <div className="channel-heading">
            <span>COURSE CHANNELS</span>
            <button
              type="button"
              className="tiny-icon"
              onClick={() => onNotification("Create channels from the admin controls.")}
              aria-label="Add channel"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          {groupRooms.map((room) => (
            <button
              type="button"
              key={room.id}
              className={`channel-item ${activeRoomId === room.id ? "selected" : ""}`}
              onClick={() => onOpenRoom(room)}
            >
              <span className="hash" aria-hidden="true"></span>
              <span className="channel-name">{room.name}</span>
            </button>
          ))}

          {/* Direct Messages */}
          <div className="channel-heading direct-heading">
            <span>DIRECT MESSAGES</span>
            <button 
              type="button" 
              className="tiny-icon" 
              onClick={() => onSelectView("members")} 
              aria-label="Start direct message"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          {directRooms.map((room) => (
            <button
              type="button"
              key={room.id}
              className={`dm-item ${activeRoomId === room.id ? "selected" : ""}`}
              onClick={() => onOpenRoom(room)}
            >
              <span className={`avatar avatar-small ${room.name === "Academy Founder" ? "avatar-orange" : ""}`} aria-hidden="true">
                {room.icon}
              </span>
              <span className="dm-name">{room.name}</span>
              {room.online && <i className="online-dot" aria-label="User is online" />}
            </button>
          ))}
        </div>

        {/* User Profile Button (Sticky at bottom) */}
        <div style={{ flexShrink: 0, padding: "12px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <button type="button" className="user-profile" onClick={onToggleProfile} aria-label="Toggle profile settings" style={{ width: "100%", margin: 0 }}>
            <div className="avatar avatar-orange">
              {profileImage ? <img src={profileImage} alt="" /> : getInitials(userName)}
            </div>
            <div className="user-info">
              <strong>{userName}</strong>
              <span>Student account ·</span>
            </div>
            <MoreHorizontal size={18} className="muted-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Profile Popover Menu */}
        {showProfile && (
          <div className="profile-popover" role="dialog" aria-label="Profile Settings">
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              value={nameDraft}
              onChange={(event) => onNameDraftChange(event.target.value)}
              maxLength={36}
            />
            <div className="profile-image-tools">
              <label className="profile-image-upload">
                <ImagePlus size={14} aria-hidden="true" />
                <span>Change profile image</span>
                <input
                  className="visually-hidden"
                  type="file"
                  accept="image/*"
                  tabIndex={-1}
                  onChange={(event) => {
                    onProfileImageSelect(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                />
              </label>
              {profileImage && (
                <button
                  type="button"
                  className="profile-image-remove"
                  onClick={() => onProfileImageSelect(null)}
                >
                  Remove image
                </button>
              )}
            </div>
            <button type="button" className="btn btn-primary btn-full" onClick={onSaveName}>
              Save name
            </button>
            <button type="button" className="text-btn" onClick={onSignOut}>
              <LogOut size={14} aria-hidden="true" /> Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Scrim / Overlay */}
      {isOpen && (
        <button 
          type="button" 
          className="mobile-scrim" 
          onClick={onClose} 
          aria-label="Close navigation overlay" 
        />
      )}
    </>
  );
}