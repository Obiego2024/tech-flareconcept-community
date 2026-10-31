import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CHAT_MESSAGES_KEY,
  CHAT_ROOMS_KEY,
  DEFAULT_CHAT_ROOMS,
  loadChatMessages,
  loadChatRooms,
  loadChatSettings,
  type ChatMessage,
} from "../chatData";
import ChatConversation from "../components/community/ChatConversation";
import CommunityHeader from "../components/community/CommunityHeader";
import CommunityInfoPanel from "../components/community/CommunityInfoPanel";
import CommunitySidebar from "../components/community/CommunitySidebar";
import CommunityToast from "../components/community/CommunityToast";
import MemberDirectory from "../components/community/MemberDirectory";
import WelcomeModal from "../components/community/WelcomeModal";
import type { CommunityRoom, CommunityView } from "../components/community/communityTypes";
import { getInitials } from "../components/community/communityTypes";

const CURRENT_USER = "You";
const WELCOME_KEY = "tf-community-welcomed";
const DISPLAY_NAME_KEY = "tf-community-name";

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function CommunityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [chatSettings] = useState(loadChatSettings);
  const [rooms, setRooms] = useState<CommunityRoom[]>(loadChatRooms);
  const [activeView, setActiveView] = useState<CommunityView>("community");
  const [activeRoomId, setActiveRoomId] = useState("general");
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(
    !localStorage.getItem(WELCOME_KEY)
  );

  const initialUserName = user?.name || localStorage.getItem(DISPLAY_NAME_KEY) || "Student";
  const [userName, setUserName] = useState(initialUserName);
  const [nameDraft, setNameDraft] = useState(initialUserName);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      // Storage might be restricted.
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
    } catch {
      // Storage might be restricted.
    }
  }, [rooms]);

  const showNotification = useCallback((message: string) => {
    setNoticeMessage(message);
    const timer = window.setTimeout(() => setNoticeMessage(""), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  const currentRoom = useMemo(
    () =>
      rooms.find((room) => room.id === activeRoomId) ??
      rooms[0] ??
      DEFAULT_CHAT_ROOMS[0],
    [rooms, activeRoomId]
  );

  const currentMessages = useMemo(
    () => messages.filter((message) => message.roomId === activeRoomId),
    [messages, activeRoomId]
  );

  const canSendMessage =
    chatSettings.chatEnabled &&
    chatSettings.memberPostingEnabled &&
    (currentRoom.type !== "direct" || chatSettings.directMessagesEnabled);

  const blockedReason = !chatSettings.chatEnabled
    ? "Chat is currently paused by an administrator."
    : currentRoom.type === "direct" && !chatSettings.directMessagesEnabled
    ? "Direct messages are currently disabled by an administrator."
    : "Member posting is currently paused by an administrator.";

  const handleOpenRoom = useCallback((room: CommunityRoom) => {
    setActiveRoomId(room.id);
    setIsMobileSidebarOpen(false);
    if (room.type === "direct") setActiveView("direct");
    else if (room.type === "announcement") setActiveView("announcements");
    else setActiveView("community");
  }, []);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !canSendMessage) return;

    const newMessage: ChatMessage = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      roomId: activeRoomId,
      sender: CURRENT_USER,
      initials: getInitials(userName),
      text,
      time: getCurrentTime(),
      mine: true,
    };

    setMessages((previous) => [...previous, newMessage]);
    setDraft("");
  };

  const handleStartDirect = useCallback((name: string) => {
    const targetRoomId = `dm-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const existingRoom = rooms.find((room) => room.id === targetRoomId || room.name === name);

    if (!existingRoom) {
      const newRoom: CommunityRoom = {
        id: targetRoomId,
        name,
        description: "Student conversation",
        type: "direct",
        icon: getInitials(name),
        members: 1,
        online: false,
      };
      setRooms((previous) => [...previous, newRoom]);
      setActiveRoomId(newRoom.id);
    } else {
      setActiveRoomId(existingRoom.id);
    }

    setActiveView("direct");
    setIsMobileSidebarOpen(false);
  }, [rooms]);

  const handleSaveName = () => {
    const nextName = nameDraft.trim();
    if (!nextName) {
      showNotification("Please enter a display name.");
      return;
    }
    setUserName(nextName);
    localStorage.setItem(DISPLAY_NAME_KEY, nextName);
    setShowProfilePopover(false);
    showNotification("Display name updated successfully.");
  };

  const handleSelectView = useCallback((view: CommunityView) => {
    setActiveView(view);
    const targetType =
      view === "community"
        ? "group"
        : view === "direct"
        ? "direct"
        : view === "announcements"
        ? "announcement"
        : null;

    if (targetType) {
      const firstMatchingRoom = rooms.find((room) => room.type === targetType);
      if (firstMatchingRoom) setActiveRoomId(firstMatchingRoom.id);
    }
    setIsMobileSidebarOpen(false);
  }, [rooms]);

  const handleToggleReaction = (messageId: string) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId
          ? {
              ...message,
              reaction: message.reaction?.includes("You") ? "🔥 3" : "🔥 3 · You",
            }
          : message
      )
    );
  };

  const handleDismissWelcome = () => {
    setShowWelcomeModal(false);
    localStorage.setItem(WELCOME_KEY, "1");
  };

  return (
    <div className="app-shell">
      <CommunitySidebar
        user={user}
        userName={userName}
        nameDraft={nameDraft}
        rooms={rooms}
        activeView={activeView}
        activeRoomId={activeRoomId}
        searchQuery={searchQuery}
        isOpen={isMobileSidebarOpen}
        showProfile={showProfilePopover}
        onSelectView={handleSelectView}
        onOpenRoom={handleOpenRoom}
        onToggleProfile={() => {
          setNameDraft(userName);
          setShowProfilePopover((previous) => !previous);
        }}
        onNameDraftChange={setNameDraft}
        onSaveName={handleSaveName}
        onSignOut={() => {
          logout();
          navigate("/login");
        }}
        onAdmin={() => navigate("/admin")}
        onNotification={showNotification}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="main-area">
        <CommunityHeader
          userName={userName}
          activeView={activeView}
          currentRoom={currentRoom}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotification={showNotification}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
        />

        {activeView === "members" ? (
          <MemberDirectory searchQuery={searchQuery} onMessage={handleStartDirect} />
        ) : (
          <div className="chat-layout">
            <ChatConversation
              activeView={activeView}
              activeRoomId={activeRoomId}
              currentRoom={currentRoom}
              messages={currentMessages}
              userName={userName}
              draft={draft}
              canSendMessage={canSendMessage}
              blockedReason={blockedReason}
              onDraftChange={setDraft}
              onSendMessage={handleSendMessage}
              onToggleReaction={handleToggleReaction}
              onNotification={showNotification}
            />
            <CommunityInfoPanel
              activeView={activeView}
              rooms={rooms}
              onSelectView={() => handleSelectView("community")}
              onOpenRoom={handleOpenRoom}
              onStartDirect={handleStartDirect}
              onNotification={showNotification}
            />
          </div>
        )}
      </main>

      {showWelcomeModal && <WelcomeModal onDismiss={handleDismissWelcome} />}
      <CommunityToast message={noticeMessage} />
    </div>
  );
}
