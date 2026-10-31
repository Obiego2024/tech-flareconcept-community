import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminOverview from "../components/admin/AdminOverview";
import AdminSidebar from "../components/admin/AdminSidebar";
import ChannelManagementPanel from "../components/admin/ChannelManagementPanel";
import ChatSettingsPanel from "../components/admin/ChatSettingsPanel";
import MessageModerationPanel from "../components/admin/MessageModerationPanel";
import StudentManagementPanel from "../components/admin/StudentManagementPanel";
import type { AdminSection, AdminNotice } from "../components/admin/adminTypes";
import { useAuth } from "../context/AuthContext";
import {
  CHAT_MESSAGES_KEY,
  CHAT_ROOMS_KEY,
  CHAT_SETTINGS_KEY,
  loadChatMessages,
  loadChatRooms,
  loadChatSettings,
  type ChatMessage,
  type ChatRoom,
  type ChatSettings,
} from "../chatData";

export default function AdminPage() {
  const { user, students, setStudentSuspended, deleteStudent, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(loadChatSettings);
  const [messages, setMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [rooms, setRooms] = useState<ChatRoom[]>(loadChatRooms);
  const [notice, setNotice] = useState<AdminNotice | null>(null);

  const handleNavigate = (section: AdminSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
    setNotice(null);
  };

  const handleSettingChange = (key: keyof ChatSettings) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    try {
      localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(nextSettings));
      setSettings(nextSettings);
      setNotice({ message: "Chat settings saved.", error: false });
    } catch {
      setNotice({ message: "Could not save settings. Check browser storage and try again.", error: true });
    }
  };

  const handleDeleteMessage = (id: string) => {
    const nextMessages = messages.filter((message) => message.id !== id);
    try {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(nextMessages));
      setMessages(nextMessages);
      setNotice({ message: "Message removed from chat.", error: false });
    } catch {
      setNotice({ message: "Could not remove the message. Check browser storage and try again.", error: true });
    }
  };

  const handleSetStudentSuspended = (email: string, suspended: boolean) => {
    const error = setStudentSuspended(email, suspended);
    setNotice(
      error
        ? { message: error, error: true }
        : {
            message: `Student account ${suspended ? "suspended" : "restored"}.`,
            error: false,
          }
    );
  };

  const handleDeleteStudent = (email: string) => {
    const error = deleteStudent(email);
    setNotice(
      error
        ? { message: error, error: true }
        : { message: "Student account deleted.", error: false }
    );
  };

  const handleAddChannel = (name: string, description: string) => {
    const normalizedName = name.trim().toLowerCase().replace(/^#+/, "").replace(/\s+/g, "-");
    if (!normalizedName) return "Enter a channel name.";
    if (rooms.some((room) => room.type === "group" && room.name.toLowerCase() === normalizedName)) {
      return "A channel with that name already exists.";
    }

    const channel: ChatRoom = {
      id: `channel-${normalizedName}-${Date.now()}`,
      name: normalizedName,
      description: description.trim() || "A community course channel",
      type: "group",
      icon: "#",
      members: 0,
    };
    const nextRooms = [...rooms, channel];
    try {
      localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(nextRooms));
      setRooms(nextRooms);
      setNotice({ message: `#${normalizedName} channel created.`, error: false });
      return null;
    } catch {
      setNotice({ message: "Could not create channel. Check browser storage and try again.", error: true });
      return "Could not save the channel. Check browser storage and try again.";
    }
  };

  const handleDeleteChannel = (roomId: string) => {
    const nextRooms = rooms.filter((room) => room.id !== roomId);
    const nextMessages = messages.filter((message) => message.roomId !== roomId);
    try {
      localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(nextRooms));
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(nextMessages));
      setRooms(nextRooms);
      setMessages(nextMessages);
      setNotice({ message: "Channel and its messages removed.", error: false });
    } catch {
      setNotice({ message: "Could not delete the channel. Check browser storage and try again.", error: true });
    }
  };

  const renderSection = () => {
    if (activeSection === "overview") {
      return (
        <AdminOverview
          messages={messages}
          rooms={rooms}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activeSection === "moderation") {
      return <MessageModerationPanel messages={messages} onRemove={handleDeleteMessage} />;
    }
    if (activeSection === "students") {
      return (
        <StudentManagementPanel
          students={students}
          onSetSuspended={handleSetStudentSuspended}
          onDelete={handleDeleteStudent}
        />
      );
    }
    if (activeSection === "channels") {
      return (
        <ChannelManagementPanel
          rooms={rooms}
          onAdd={handleAddChannel}
          onRemove={handleDeleteChannel}
        />
      );
    }
    return <ChatSettingsPanel value={settings} onChange={handleSettingChange} />;
  };

  return (
    <div className="flex min-h-screen bg-[#101010] text-[#f5f5f5]">
      <AdminSidebar
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        onNavigate={handleNavigate}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader
          activeSection={activeSection}
          userName={user?.name ?? "Administrator"}
          onBack={() => navigate("/community")}
          onSignOut={() => {
            logout();
            navigate("/login");
          }}
          onMenu={() => setIsSidebarOpen(true)}
        />

        <main className="w-full flex-1 px-4 py-5 sm:px-7 sm:py-7">
          <div className="mx-auto max-w-360">
            <div className="mb-5 rounded-xl border border-[#46301f] bg-[#211a15] px-4 py-3 text-[10px] leading-5 text-[#d3b49c]">
              <strong className="font-semibold text-[#f3c5a2]">Demo environment.</strong> Admin controls, chat history, and channels are stored in this browser only. This is not server-side authentication or moderation.
            </div>

            {renderSection()}

            {notice && (
              <p
                role={notice.error ? "alert" : "status"}
                className={`mt-4 text-[11px] ${notice.error ? "text-[#ff9c8b]" : "text-[#8de0ad]"}`}
              >
                {notice.message}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
