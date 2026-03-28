"use client";

const IconHash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3 8 21" />
    <path d="m16 3-2 18" />
  </svg>
);

const IconMessage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface Room { id: string; name: string; description: string | null; }
interface DMConvo { username: string; lastMessage: string; time: string; }

interface Props {
  rooms: Room[];
  activeRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  dmConvos: DMConvo[];
  activeDM: string | null;
  onDMSelect: (username: string) => void;
  onlineUsers: string[];
  offlineRecent?: string[];
  currentUser: string;
  onStartDM: (username: string) => void;
  tab: "rooms" | "messages" | "users";
  onTabChange: (tab: "rooms" | "messages" | "users") => void;
  dmUnread: Record<string, number>;
}

export default function Sidebar({
  rooms, activeRoom, onRoomSelect,
  dmConvos, activeDM, onDMSelect,
  onlineUsers, offlineRecent = [], currentUser, onStartDM,
  tab, onTabChange, dmUnread,
}: Props) {
  const totalDmUnread = Object.values(dmUnread).reduce((a, b) => a + (b || 0), 0);
  const tabs = [
    { id: "rooms" as const, label: "Rooms", icon: <IconHash /> },
    { id: "messages" as const, label: "DMs", icon: <IconMessage />, badge: totalDmUnread },
    { id: "users" as const, label: "Users", icon: <IconUsers /> },
  ];

  const displayNameOf = (u: string) => u.split("#", 1)[0] || u;

  return (
    <aside style={{
      width: 260, flexShrink: 0,
      background: "white",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onTabChange(t.id)} style={{
            flex: 1, padding: "0.75rem 0.25rem",
            background: tab === t.id ? "var(--primary-50)" : "transparent",
            color: tab === t.id ? "var(--primary)" : "var(--text-muted)",
            border: "none", borderBottom: tab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
            cursor: "pointer", fontWeight: 600, fontSize: "0.75rem",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: "1rem" }}>{t.icon}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              {t.label}
              {t.badge ? (
                <span style={{ background: "var(--primary)", color: "white", borderRadius: 999, padding: "0 0.45rem", fontSize: "0.65rem", fontWeight: 800 }}>
                  {t.badge}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
        {/* Rooms */}
        {tab === "rooms" && (
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0.5rem 0.25rem" }}>Public Rooms</p>
            {rooms.map(room => (
              <button key={room.id} onClick={() => onRoomSelect(room)} style={{
                width: "100%", textAlign: "left", padding: "0.625rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                background: activeRoom?.id === room.id ? "var(--primary-50)" : "transparent",
                border: "none", cursor: "pointer",
                color: activeRoom?.id === room.id ? "var(--primary)" : "var(--text)",
                fontWeight: activeRoom?.id === room.id ? 600 : 400,
                display: "flex", alignItems: "center", gap: "0.5rem",
                transition: "all 0.15s", fontSize: "0.88rem",
              }}>
                <span style={{ width: 28, height: 28, background: activeRoom?.id === room.id ? "var(--primary)" : "var(--primary-100)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: activeRoom?.id === room.id ? "white" : "var(--primary)", fontWeight: 700, flexShrink: 0 }}>#</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.name}</div>
                  {room.description && <div style={{ fontSize: "0.72rem", color: "var(--text-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.description}</div>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* DMs */}
        {tab === "messages" && (
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0.5rem 0.25rem" }}>Direct Messages</p>
            {dmConvos.length === 0 && (
              <p style={{ color: "var(--text-light)", fontSize: "0.82rem", padding: "0.75rem", textAlign: "center" }}>No DMs yet. Click a user to message them.</p>
            )}
            {dmConvos.map(dm => {
              const unread = dmUnread[dm.username] || 0;
              const name = displayNameOf(dm.username);
              return (
                <button key={dm.username} onClick={() => onDMSelect(dm.username)} style={{
                  width: "100%", textAlign: "left", padding: "0.625rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  background: activeDM === dm.username ? "var(--primary-50)" : "transparent",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: 32, height: 32, background: `hsl(${name.length * 37 % 360}, 60%, 55%)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>
                    {name[0].toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dm.lastMessage}</div>
                  </div>
                  {unread > 0 && (
                    <span style={{ background: "var(--primary)", color: "white", borderRadius: 999, padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 800 }}>
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Online Users */}
        {tab === "users" && (
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0.5rem 0.25rem" }}>
              Online · {onlineUsers.length}
            </p>
            {onlineUsers.map(u => (
              <button
                key={u}
                onClick={() => u !== currentUser && onStartDM(u)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: "transparent",
                  cursor: u === currentUser ? "default" : "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="online-dot" />
                  <div style={{ width: 28, height: 28, background: `hsl(${displayNameOf(u).length * 37 % 360}, 60%, 55%)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.75rem" }}>{displayNameOf(u)[0].toUpperCase()}</div>
                  <span style={{ fontWeight: u === currentUser ? 700 : 400, fontSize: "0.85rem", color: u === currentUser ? "var(--primary)" : "var(--text)" }}>
                    {displayNameOf(u)}{u === currentUser ? " (you)" : ""}
                  </span>
                </div>
                {u !== currentUser && (
                  <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>Start DM →</span>
                )}
              </button>
            ))}
            {offlineRecent.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.5rem" }}>
                  Recently offline
                </p>
                {offlineRecent.map(u => (
                  <div key={`offline-${u}`} style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    color: "var(--text-light)",
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />
                    <div style={{ width: 28, height: 28, background: `hsl(${displayNameOf(u).length * 37 % 360}, 20%, 75%)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", fontWeight: 700, fontSize: "0.75rem" }}>{displayNameOf(u)[0].toUpperCase()}</div>
                    <span style={{ fontSize: "0.85rem" }}>{displayNameOf(u)}</span>
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 600 }}>offline</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
