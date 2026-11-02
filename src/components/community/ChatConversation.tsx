import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  FileText,
  ImagePlus,
  Megaphone,
  Mic,
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
  X,
} from "lucide-react";
import type { ChatAttachment, ChatMessage } from "../../chatData";
import type { CommunityRoom, CommunityView } from "./communityTypes";
import { getInitials } from "./communityTypes";

const MAX_ATTACHMENT_SIZE = 1.5 * 1024 * 1024;
const CHAT_EMOJIS = ["😀", "😂", "🥰", "😍", "😎", "🤔", "👏", "🙌", "🔥", "❤️", "💯", "🎉", "🚀", "✨", "👋", "💡", "💻", "🙏", "😅", "🤩"];

interface ChatConversationProps {
  activeView: CommunityView;
  activeRoomId: string;
  currentRoom: CommunityRoom;
  messages: ChatMessage[];
  userName: string;
  profileImage: string;
  draft: string;
  canSendMessage: boolean;
  blockedReason: string;
  onDraftChange: (draft: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
  onSendAttachment: (attachment: ChatAttachment) => void;
  onToggleReaction: (messageId: string) => void;
  onNotification: (message: string) => void;
}

export default function ChatConversation({
  activeView,
  activeRoomId,
  currentRoom,
  messages,
  userName,
  profileImage,
  draft,
  canSendMessage,
  blockedReason,
  onDraftChange,
  onSendMessage,
  onSendAttachment,
  onToggleReaction,
  onNotification,
}: ChatConversationProps) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (recorderRef.current) recorderRef.current.onstop = null;
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    if (recordingTimeoutRef.current !== null) {
      window.clearTimeout(recordingTimeoutRef.current);
    }
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

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

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const isImagePicker = event.currentTarget.accept === "image/*";
    event.target.value = "";
    if (!file) return;
    if (file.type === "image/svg+xml" || (isImagePicker && !file.type.startsWith("image/"))) {
      onNotification("Choose a supported image file (SVG is not supported).");
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      onNotification("Files must be 1.5 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => onNotification("Unable to read this file. Please try another.");
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        onNotification("Unable to read this file. Please try another.");
        return;
      }
      onSendAttachment({
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceNote = async () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      onNotification("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) audioChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        onNotification("Voice recording failed. Please try again.");
        if (recorder.state !== "inactive") recorder.stop();
      };
      recorder.onstop = () => {
        recorderRef.current = null;
        setIsRecording(false);
        if (recordingTimeoutRef.current !== null) {
          window.clearTimeout(recordingTimeoutRef.current);
          recordingTimeoutRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
        recordingStreamRef.current = null;
        const audio = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (!audio.size) {
          onNotification("No audio was recorded. Please try again.");
          return;
        }
        if (audio.size > MAX_ATTACHMENT_SIZE) {
          onNotification("This voice note is too large. Record a shorter note.");
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => onNotification("Unable to save this voice note.");
        reader.onload = () => {
          if (typeof reader.result !== "string") {
            onNotification("Unable to save this voice note.");
            return;
          }
          const extension = audio.type.split("/")[1]?.split(";")[0] || "webm";
          onSendAttachment({
            name: `voice-note-${Date.now()}.${extension}`,
            mimeType: audio.type,
            dataUrl: reader.result,
          });
        };
        reader.readAsDataURL(audio);
      };
      recorder.start();
      setIsRecording(true);
      recordingTimeoutRef.current = window.setTimeout(() => {
        if (recorderRef.current === recorder) {
          recorder.stop();
          setIsRecording(false);
          onNotification("Voice note stopped after 60 seconds.");
        }
      }, 60_000);
    } catch {
      recorderRef.current = null;
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
      setIsRecording(false);
      onNotification("Microphone access was denied or unavailable.");
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
                  {message.mine && profileImage
                    ? <img src={profileImage} alt="" />
                    : message.mine ? getInitials(userName) : message.initials}
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
                {message.attachment && (
                  <div className="message-attachment">
                    {message.attachment.mimeType.startsWith("image/") ? (
                      <a href={message.attachment.dataUrl} target="_blank" rel="noreferrer">
                        <img src={message.attachment.dataUrl} alt={message.attachment.name} />
                      </a>
                    ) : message.attachment.mimeType.startsWith("audio/") ? (
                      <audio controls preload="metadata" src={message.attachment.dataUrl}>
                        Your browser does not support audio playback.
                      </audio>
                    ) : (
                      <a
                        className="file-attachment"
                        href={message.attachment.dataUrl}
                        download={message.attachment.name}
                      >
                        <FileText size={17} aria-hidden="true" />
                        <span>{message.attachment.name}</span>
                      </a>
                    )}
                  </div>
                )}
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
            onClick={() => imageInputRef.current?.click()}
            aria-label="Attach file"
            title="Add an image"
            disabled={!canSendMessage}
          >
            <ImagePlus size={18} />
          </button>
          <input
            ref={imageInputRef}
            className="visually-hidden"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            aria-label="Choose an image"
            tabIndex={-1}
          />
          <button
            type="button"
            className="composer-tool"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach a file"
            title="Add a file (up to 1.5 MB)"
            disabled={!canSendMessage}
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            className="visually-hidden"
            type="file"
            onChange={handleUpload}
            aria-label="Choose a file"
            tabIndex={-1}
          />

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
            onClick={() => setEmojiPickerOpen((open) => !open)}
            aria-label="Add emoji"
            aria-expanded={emojiPickerOpen}
            disabled={!canSendMessage}
          >
            <Smile size={18} />
          </button>

          <button
            type="button"
            className={`composer-tool voice-tool ${isRecording ? "recording" : ""}`}
            onClick={handleVoiceNote}
            aria-label={isRecording ? "Stop and send voice note" : "Record voice note"}
            title={isRecording ? "Stop and send voice note" : "Record a voice note"}
            disabled={!canSendMessage}
          >
            {isRecording ? <X size={18} /> : <Mic size={18} />}
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

        {emojiPickerOpen && (
          <div className="emoji-picker" role="group" aria-label="Choose an emoji">
            {CHAT_EMOJIS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  onDraftChange(`${draft}${emoji}`);
                  setEmojiPickerOpen(false);
                }}
                aria-label={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="composer-foot">
          <span><kbd>Enter</kbd> to send <span className="foot-dot">·</span> Attachments up to 1.5 MB <span className="foot-dot">·</span> Be kind and constructive</span>
          <span>Powered by <strong>TF Academy</strong></span>
        </div>
      </form>
    </section>
  );
}