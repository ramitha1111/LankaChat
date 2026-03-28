"use client";
import { timeAgo } from "@/lib/utils";

interface Message {
  id: string;
  sender_username: string;
  content: string;
  created_at: string;
  receiver_username?: string | null;
}

interface Props {
  message: Message;
  currentUser: string;
  displayNameFormatter?: (name: string) => string;
}

export default function MessageBubble({ message, currentUser, displayNameFormatter = (n) => n }: Props) {
  const displayName = displayNameFormatter(message.sender_username);
  const isOwn = message.sender_username === currentUser;
  const isDM = !!message.receiver_username;

  return (
    <div className="animate-fade" style={{
      display: "flex",
      flexDirection: isOwn ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: "0.6rem",
      marginBottom: "0.75rem",
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32,
        background: `hsl(${displayName.length * 37 % 360}, 60%, 55%)`,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 700, fontSize: "0.8rem",
        flexShrink: 0,
      }}>
        {displayName[0]?.toUpperCase()}
      </div>

      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem", textAlign: isOwn ? "right" : "left", width: "100%" }}>
          {displayName}
          {isDM && <span style={{ color: "var(--accent)", marginLeft: "0.35rem" }}>🗨 DM</span>}
          {isOwn && <span style={{ color: "var(--primary)", marginLeft: "0.35rem", fontWeight: 600 }}>(you)</span>}
        </span>
        <div style={{
          padding: "0.65rem 0.95rem",
          borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isOwn
            ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
            : "white",
          color: isOwn ? "white" : "var(--text)",
          fontSize: "0.9rem",
          lineHeight: 1.5,
          boxShadow: isOwn ? "0 2px 8px rgba(37,99,235,0.25)" : "var(--shadow-sm)",
          border: isOwn ? "none" : "1px solid var(--border)",
          wordBreak: "break-word",
        }}>
          {message.content}
        </div>
        <span style={{ fontSize: "0.68rem", color: "var(--text-light)", marginTop: "0.25rem", textAlign: isOwn ? "right" : "left", width: "100%" }}>
          {timeAgo(message.created_at)}
        </span>
      </div>
    </div>
  );
}
