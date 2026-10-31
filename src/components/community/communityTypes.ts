import type { ChatMessage, ChatRoom } from "../../chatData";

export type CommunityView = "community" | "direct" | "announcements" | "members";
export type CommunityRoom = ChatRoom;

export const COMMUNITY_PEOPLE = [
  { name: "Amara Okafor", role: "Frontend Development", initials: "AO", online: true },
  { name: "David James", role: "Backend Development", initials: "DJ", online: true },
  { name: "Academy Founder", role: "Founder · Admin", initials: "TF", online: false },
  { name: "Chidinma Eze", role: "Data Analytics", initials: "CE", online: true },
  { name: "Michael Obi", role: "Cybersecurity", initials: "MO", online: false },
  { name: "Sarah Williams", role: "Frontend Development", initials: "SW", online: false },
];

export const getInitials = (name: string): string =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export type { ChatMessage };
