import { CircleHelp, Hash, MoreHorizontal, Users } from "lucide-react";
import { COMMUNITY_PEOPLE, type CommunityRoom } from "./communityTypes";

interface CommunityInfoPanelProps {
  activeView: "community" | "direct" | "announcements";
  rooms: CommunityRoom[];
  onSelectView: () => void;
  onOpenRoom: (room: CommunityRoom) => void;
  onStartDirect: (name: string) => void;
  onNotification: (message: string) => void;
}

export default function CommunityInfoPanel({
  activeView,
  rooms,
  onSelectView,
  onOpenRoom,
  onStartDirect,
  onNotification,
}: CommunityInfoPanelProps) {
  const popularRooms = rooms.filter((room) => room.type === "group").slice(0, 3);

  return (
    <aside className="right-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">YOUR COMMUNITY</span>
          <h3>{activeView === "direct" ? "Conversation info" : "Community pulse"}</h3>
        </div>
        <button
          className="icon-btn"
          onClick={() => onNotification("Panel options are coming soon.")}
          aria-label="Panel options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="pulse-card">
        <div className="pulse-graphic">
          <div className="pulse-orbit orbit-one" />
          <div className="pulse-orbit orbit-two" />
          <div className="pulse-core"><Users size={23} /></div>
          <span className="pulse-dot dot-one" />
          <span className="pulse-dot dot-two" />
          <span className="pulse-dot dot-three" />
        </div>
        <div className="pulse-stat"><strong>128</strong><span>students in the community</span></div>
        <div className="pulse-bottom">
          <span><i className="green-dot" /> 18 active today</span>
          <span className="pulse-change">Keep it growing!</span>
        </div>
      </div>
      <div className="panel-section">
        <div className="section-title">
          <h4>Popular channels</h4>
          <button onClick={onSelectView}>View all</button>
        </div>
        {popularRooms.length === 0 ? (
          <p className="text-xs text-[#888]">No channels available.</p>
        ) : popularRooms.map((room, index) => (
          <button className="popular-channel" key={room.id} onClick={() => onOpenRoom(room)}>
            <span className={`popular-icon popular-${index}`}><Hash size={16} /></span>
            <span className="popular-info">
              <strong>{room.name}</strong><small>{room.members} students</small>
            </span>
            <span className="popular-arrow">↗</span>
          </button>
        ))}
      </div>
      <div className="panel-section online-section">
        <div className="section-title"><h4>Students online</h4><span className="online-count">3 online</span></div>
        {COMMUNITY_PEOPLE.filter((person) => person.online).slice(0, 3).map((person) => (
          <button className="online-person" key={person.name} onClick={() => onStartDirect(person.name)}>
            <span className="avatar avatar-small">{person.initials}</span>
            <span className="online-person-info"><strong>{person.name}</strong><small>{person.role}</small></span>
            <i className="online-dot" />
          </button>
        ))}
      </div>
      <div className="help-card">
        <div className="help-icon"><CircleHelp size={19} /></div>
        <div>
          <strong>Need a hand?</strong>
          <p>Ask your classmates or reach out to your instructor.</p>
          <button onClick={() => onStartDirect("Academy Founder")}>Contact academy team <span>→</span></button>
        </div>
      </div>
      <div className="panel-footer"><span>Made for learners, by learners.</span><span>v1.0 DEMO</span></div>
    </aside>
  );
}
