import type { FormEvent } from "react";
import {
  Megaphone,
  MoreHorizontal,
  Paperclip,
  Pin,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  UserRound,
  Users,
  MessageSquare,
  MessageCircle,
  Code2,
} from "lucide-react";
import type { ChatMessage } from "../../chatData";
import type { CommunityRoom, CommunityView } from "./communityTypes";
import { getInitials } from "./communityTypes";

interface ChatConversationProps {
  activeView: CommunityView;
  activeRoomId: string;
  currentRoom: CommunityRoom;
  messages: ChatMessage[];
  userName: string;
  draft: string;
  canSendMessage: boolean;
  blockedReason: string;
  onDraftChange: (draft: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onToggleReaction: (messageId: string) => void;
  onNotification: (message: string) => void;
}

export default function ChatConversation({
  activeView,
  activeRoomId,
  currentRoom,
  messages,
  userName,
  draft,
  canSendMessage,
  blockedReason,
  onDraftChange,
  onSendMessage,
  onToggleReaction,
  onNotification,
}: ChatConversationProps) {
  
  // Helper to determine composer input placeholder
  const getPlaceholderText = () => {
    if (activeRoomId === "announcements") return "Message #academy-announcements...";
    if (activeRoomId.startsWith("dm-")) return `Message ${currentRoom.name}...`;
    return `Message #${currentRoom.name}...`;
  };

  const handleCopyMessage = async (text: string) => {
    if (!navigator.clipboard?.writeText) {
      onNotification("Clipboard access is unavailable in this browser.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      onNotification("Message copied to clipboard.");
    } catch {
      onNotification("Unable to copy the message.");
    }
  };

  return (
    <section className="chat-main" aria-label="Chat Conversation">
      {/* Banner: Community View */}
      {activeView === "community" && (
        <div className="channel-banner">
          <div className="banner-copy">
            <div className="banner-title capitalize">
              {currentRoom.name}
              <span className="pill-live"><i /> COMMUNITY</span>
            </div>
            <p>{currentRoom.description}</p>
          </div>
          <div className="banner-members">
            <Users size={16} /> {currentRoom.members} <span>members</span>
          </div>
          <button
            className="icon-btn banner-more"
            onClick={() => onNotification("Channel settings are a demo placeholder.")}
            aria-label="Channel options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      )}

      {/* Banner: Direct Message View */}
      {activeView === "direct" && (
        <div className="channel-banner">
          <div className="avatar avatar-large">{currentRoom.icon}</div>
          <div className="banner-copy">
            <div className="banner-title">
              {currentRoom.name}
              <span className="pill-private"><UserRound size={11} /> PRIVATE CHAT</span>
            </div>
            <p>{currentRoom.description}</p>
          </div>
          <button
            className="icon-btn banner-more"
            onClick={() => onNotification("Conversation options are a demo placeholder.")}
            aria-label="Conversation options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      )}

      {/* Banner: Announcements View */}
      {activeView === "announcements" && (
        <div className="channel-banner announcement-banner">
          <div className="banner-icon"><Megaphone size={21} /></div>
          <div className="banner-copy">
            <div className="banner-title">
              Academy announcements <span className="pill-live">OFFICIAL</span>
            </div>
            <p>Important updates from Tech Flareconcept Academy</p>
          </div>
        </div>
      )}

      {/* Message Scroll Area */}
      <div className="message-scroll" key={activeRoomId}>
        {activeView === "community" && (
          <div className="welcome-channel">
            <div className="welcome-header flex items-center gap-2">
              <div className="welcome-symbol"><Sparkles size={23} /></div>
            <h2 className="capitalize">Welcome to {currentRoom.name}!</h2>
            </div>
            {/* <p>{currentRoom.description}. Introduce yourself, ask questions, and help your fellow students grow.</p> */}
            <div className="welcome-tags">
              <span><MessageCircle size={13} /> Be helpful</span>
              <span><ShieldCheck size={13} /> Be respectful</span>
              <span><Code2 size={13} /> Keep learning</span>
            </div>
          </div>
        )}

        {activeView === "announcements" && (
          <div className="pinned-notice">
            <Pin size={15} />
            <div>
              <strong>Community guidelines</strong>
              <p>Be respectful, protect your privacy, avoid spam, and share learning-related content. Official announcements are posted by academy staff.</p>
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-icon"><MessageSquare size={24} /></div>
            <h3>This is the beginning of your conversation</h3>
            <p>Send the first message below.</p>
          </div>
        )}

        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const grouped = previous && previous.sender === message.sender && previous.time === message.time;
          
          return (
            <div className={`message-row ${message.mine ? "my-message" : ""}`} key={message.id}>
              {!grouped ? (
                <div className={`avatar message-avatar ${message.sender === "Academy Founder" ? "avatar-orange" : ""}`}>
                  {message.mine ? getInitials(userName) : message.initials}
                </div>
              ) : (
                <div className="avatar-spacer" />
              )}
              
              <div className="message-body">
                {!grouped && (
                  <div className="message-meta">
                    <strong>{message.mine ? userName : message.sender}</strong>
                    {message.sender === "Academy Founder" && <span className="role-tag">FOUNDER</span>}
                    <time>{message.time}</time>
                  </div>
                )}
                <div className="message-text">{message.text}</div>
                {message.reaction && (
                  <button className="reaction" onClick={() => onToggleReaction(message.id)}>
                    {message.reaction}
                  </button>
                )}
              </div>

              <button
                className="message-more"
                onClick={() => handleCopyMessage(message.text)}
                aria-label="Copy message text"
              >
                <MoreHorizontal size={17} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Message Composer Form */}
      <form className="composer-wrap" onSubmit={onSendMessage}>
        {!canSendMessage && (
          <div className="read-only-hint">
            <ShieldCheck size={14} /> {blockedReason}
          </div>
        )}
        {activeView === "announcements" && (
          <div className="read-only-hint">
            <ShieldCheck size={14} /> Demo note: announcement permissions are not enforced in this frontend version.
          </div>
        )}

        <div className="composer">
          <button
            type="button"
            className="composer-tool"
            onClick={() => onNotification("File uploads will be added in a future version.")}
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>

          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            disabled={!canSendMessage}
            placeholder={getPlaceholderText()}
            aria-label="Write a message"
          />

          <button
            type="button"
            className="composer-tool emoji-tool"
            onClick={() => onDraftChange(`${draft} 😊`)}
            aria-label="Add emoji"
            disabled={!canSendMessage}
          >
            <Smile size={18} />
          </button>

          <button 
            type="submit" 
            className="send-btn" 
            disabled={!draft.trim() || !canSendMessage} 
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>

        <div className="composer-foot">
          <span><kbd>Enter</kbd> to send <span className="foot-dot">·</span> Be kind and constructive</span>
          <span>Powered by <strong>TF Academy</strong></span>
        </div>
      </form>
    </section>
  );
}