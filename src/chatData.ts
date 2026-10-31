export type ChatMessage = {
  id: string;
  roomId: string;
  sender: string;
  initials: string;
  text: string;
  time: string;
  mine: boolean;
  reaction?: string;
};

export type ChatSettings = {
  chatEnabled: boolean;
  memberPostingEnabled: boolean;
  directMessagesEnabled: boolean;
};

export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  type: "group" | "direct" | "announcement";
  icon: string;
  members: number;
  online?: boolean;
};

export const CHAT_MESSAGES_KEY = "tf-academy-community-v1";
export const CHAT_SETTINGS_KEY = "tf-academy-chat-settings-v1";
export const CHAT_ROOMS_KEY = "tf-academy-chat-rooms-v1";

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  chatEnabled: true,
  memberPostingEnabled: true,
  directMessagesEnabled: true,
};

export const DEFAULT_CHAT_ROOMS: ChatRoom[] = [
  { id: "general", name: "general-chat", description: "The main hangout for everyone", type: "group", icon: "✦", members: 128 },
  { id: "frontend", name: "frontend-dev", description: "HTML, CSS, JavaScript and React", type: "group", icon: "⌘", members: 42 },
  { id: "backend", name: "backend-dev", description: "APIs, databases and server-side", type: "group", icon: "{ }", members: 31 },
  { id: "cyber", name: "cybersecurity", description: "Learn safely, share labs and notes", type: "group", icon: "⌁", members: 28 },
  { id: "data", name: "data-analytics", description: "Data, dashboards and insights", type: "group", icon: "▥", members: 25 },
  { id: "projects", name: "project-showcase", description: "Show what you are building", type: "group", icon: "✧", members: 56 },
  { id: "dm-amara", name: "Amara Okafor", description: "Frontend student", type: "direct", icon: "AO", members: 1, online: true },
  { id: "dm-david", name: "David James", description: "Backend student", type: "direct", icon: "DJ", members: 1, online: true },
  { id: "dm-founder", name: "Academy Founder", description: "Founder and community admin", type: "direct", icon: "TF", members: 1 },
  { id: "announcements", name: "academy-announcements", description: "Official academy news and updates", type: "announcement", icon: "!", members: 128 },
];

export const SEED_MESSAGES: ChatMessage[] = [
  { id: "m1", roomId: "general", sender: "Amara Okafor", initials: "AO", text: "Hey everyone! 👋 Welcome to the community. What are you all learning this week?", time: "09:14 AM", mine: false },
  { id: "m2", roomId: "general", sender: "David James", initials: "DJ", text: "I'm working on my first React project. The components are finally making sense!", time: "09:18 AM", mine: false, reaction: "🔥 3" },
  { id: "m3", roomId: "general", sender: "You", initials: "YO", text: "That's great! Keep going. Small progress every day adds up 🚀", time: "09:22 AM", mine: true },
  { id: "m4", roomId: "frontend", sender: "Amara Okafor", initials: "AO", text: "Does anyone have a good explanation of React props vs state?", time: "10:05 AM", mine: false },
  { id: "m5", roomId: "backend", sender: "David James", initials: "DJ", text: "Just finished my first REST API practice project. Next up: databases!", time: "11:32 AM", mine: false },
  { id: "m6", roomId: "cyber", sender: "Academy Founder", initials: "TF", text: "Reminder: only practise security techniques in authorised labs and environments. Keep learning responsibly.", time: "08:45 AM", mine: false },
  { id: "m7", roomId: "data", sender: "Amara Okafor", initials: "AO", text: "I found a useful dataset for practising dashboards. I'll share the project in the showcase channel.", time: "12:10 PM", mine: false },
  { id: "m8", roomId: "announcements", sender: "Academy Founder", initials: "TF", text: "Welcome to the Tech Flareconcept Academy Student Community! Please be respectful, support fellow students, and keep conversations focused on learning.", time: "08:00 AM", mine: false },
  { id: "m9", roomId: "projects", sender: "David James", initials: "DJ", text: "My portfolio landing page is ready for feedback. What makes a student portfolio stand out to you?", time: "01:06 PM", mine: false },
  { id: "m10", roomId: "dm-amara", sender: "Amara Okafor", initials: "AO", text: "Hi! Are you joining the frontend study session later?", time: "12:22 PM", mine: false },
  { id: "m11", roomId: "dm-david", sender: "David James", initials: "DJ", text: "Thanks for the project feedback earlier. Really helpful!", time: "Yesterday", mine: false },
  { id: "m12", roomId: "dm-founder", sender: "Academy Founder", initials: "TF", text: "Welcome! Reach out here if you need help finding the right course channel.", time: "Yesterday", mine: false },
];

export function loadChatMessages(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ChatMessage[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fall back to seed messages if local storage fails.
  }
  return SEED_MESSAGES;
}

export function loadChatSettings(): ChatSettings {
  try {
    const saved = localStorage.getItem(CHAT_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<ChatSettings>;
      return {
        chatEnabled: typeof parsed.chatEnabled === "boolean" ? parsed.chatEnabled : true,
        memberPostingEnabled: typeof parsed.memberPostingEnabled === "boolean" ? parsed.memberPostingEnabled : true,
        directMessagesEnabled: typeof parsed.directMessagesEnabled === "boolean" ? parsed.directMessagesEnabled : true,
      };
    }
  } catch {
    // Keep chat available with its default settings if storage is unavailable.
  }
  return DEFAULT_CHAT_SETTINGS;
}

export function loadChatRooms(): ChatRoom[] {
  try {
    const saved = localStorage.getItem(CHAT_ROOMS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ChatRoom[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Keep the default channels available if stored data cannot be read.
  }
  return DEFAULT_CHAT_ROOMS;
}
