import { MessageCircle, Users } from "lucide-react";
import { COMMUNITY_PEOPLE } from "./communityTypes";

interface MemberDirectoryProps {
  searchQuery: string;
  onMessage: (name: string) => void;
}

export default function MemberDirectory({ searchQuery, onMessage }: MemberDirectoryProps) {
  const search = searchQuery.trim().toLowerCase();
  const people = COMMUNITY_PEOPLE.filter(
    (person) =>
      !search ||
      person.name.toLowerCase().includes(search) ||
      person.role.toLowerCase().includes(search)
  );

  return (
    <section className="members-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><Users size={14} /> COMMUNITY PEOPLE</div>
          <h1>Student directory</h1>
          <p>Meet fellow learners and start a conversation.</p>
        </div>
        <span className="member-total"><Users size={16} /> {COMMUNITY_PEOPLE.length} members</span>
      </div>
      {people.length === 0 ? (
        <div className="empty-chat">
          <div className="empty-icon"><Users size={24} /></div>
          <h3>No students found</h3>
          <p>Try a different name or course search.</p>
        </div>
      ) : (
        <div className="member-grid">
          {people.map((person) => (
            <article className="member-card" key={person.name}>
              <div className="member-card-top">
                <div className={`avatar avatar-large ${person.name === "Academy Founder" ? "avatar-orange" : ""}`}>
                  {person.initials}
                </div>
                <span className={`status-pill ${person.online ? "status-online" : ""}`}>
                  <i />{person.online ? "Online" : "Offline"}
                </span>
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <button className="btn btn-outline btn-full" onClick={() => onMessage(person.name)}>
                <MessageCircle size={15} /> Message student
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
