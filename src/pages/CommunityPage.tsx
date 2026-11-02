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
  type ChatAttachment,
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
const PROFILE_IMAGE_KEY = "tf-community-profile-image";
const MAX_PROFILE_IMAGE_SIZE = 1 * 1024 * 1024;

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function CommunityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileImageStorageKey = `${PROFILE_IMAGE_KEY}:${user?.email?.toLowerCase() ?? "guest"}`;

  const [messages, setMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [chatSettings] = useState(loadChatSettings);
  const [rooms, setRooms] = useState<CommunityRoom[]>(loadChatRooms);
  const [activeView, setActiveView] = useState<CommunityView>("community");
  const [activeRoomId, setActiveRoomId] = useState("general");
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(
    !localStorage.getItem(WELCOME_KEY)
  );

  const initialUserName = user?.name || localStorage.getItem(DISPLAY_NAME_KEY) || "Student";
  const [userName, setUserName] = useState(initialUserName);
  const [nameDraft, setNameDraft] = useState(initialUserName);
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(profileImageStorageKey) ?? ""
  );

  const showNotification = useCallback((message: string) => {
    setNoticeMessage(message);
    const timer = window.setTimeout(() => setNoticeMessage(""), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      showNotification("Chat history could not be saved. Browser storage may be full.");
    }
  }, [messages, showNotification]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
    } catch {
      // Storage might be restricted.
    }
  }, [rooms]);

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

  const handleSendAttachment = (attachment: ChatAttachment) => {
    if (!canSendMessage) return;
    const text = attachment.mimeType.startsWith("image/")
      ? "Shared an image"
      : attachment.mimeType.startsWith("audio/")
      ? "Sent a voice note"
      : "Shared a file";
    const newMessage: ChatMessage = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      roomId: activeRoomId,
      sender: CURRENT_USER,
      initials: getInitials(userName),
      text,
      time: getCurrentTime(),
      mine: true,
      attachment,
    };
    setMessages((previous) => [...previous, newMessage]);
  };

  const handleProfileImageSelect = (file: File | null) => {
    if (!file) {
      try {
        localStorage.removeItem(profileImageStorageKey);
        setProfileImage("");
        showNotification("Profile image removed.");
      } catch {
        showNotification("Could not remove your profile image. Check browser storage.");
      }
      return;
    }
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      showNotification("Choose a supported image file (SVG is not supported).");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      showNotification("Profile images must be 1 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => showNotification("Unable to read this image. Please try another.");
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        showNotification("Unable to read this image. Please try another.");
        return;
      }
      try {
        localStorage.setItem(profileImageStorageKey, reader.result);
        setProfileImage(reader.result);
        showNotification("Profile image updated.");
      } catch {
        showNotification("Could not save your profile image. Check browser storage.");
      }
    };
    reader.readAsDataURL(file);
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
        profileImage={profileImage}
        nameDraft={nameDraft}
        rooms={rooms}
        activeView={activeView}
        activeRoomId={activeRoomId}
        searchQuery={searchQuery}
        isOpen={isMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        showProfile={showProfilePopover}
        onSelectView={handleSelectView}
        onOpenRoom={handleOpenRoom}
        onToggleProfile={() => {
          setNameDraft(userName);
          setShowProfilePopover((previous) => !previous);
        }}
        onNameDraftChange={setNameDraft}
        onSaveName={handleSaveName}
        onProfileImageSelect={handleProfileImageSelect}
        onSignOut={() => {
          logout();
          navigate("/login");
        }}
        onAdmin={() => navigate("/admin")}
        onNotification={showNotification}
        onClose={() => setIsMobileSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((previous) => !previous)}
        onMessage={handleStartDirect}
      />

      <main className="main-area">
        <CommunityHeader
          userName={userName}
          profileImage={profileImage}
          activeView={activeView}
          currentRoom={currentRoom}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotification={showNotification}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((previous) => !previous)}
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
              profileImage={profileImage}
              draft={draft}
              canSendMessage={canSendMessage}
              blockedReason={blockedReason}
              onDraftChange={setDraft}
              onSendMessage={handleSendMessage}
              onSendAttachment={handleSendAttachment}
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
