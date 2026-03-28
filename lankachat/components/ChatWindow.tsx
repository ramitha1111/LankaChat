"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import MessageBubble from "./MessageBubble";
import Sidebar from "./Sidebar";
import UsernameModal from "./UsernameModal";

const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconHash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3 8 21" />
    <path d="m16 3-2 18" />
  </svg>
);

const IconInfo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

interface Room { id: string; name: string; description: string | null; }
interface Message { id: string; room_id: string | null; sender_username: string; receiver_username: string | null; content: string; created_at: string; }

interface Props { rooms: Room[]; }

const formatName = (name: string) => name.split("#", 1)[0] || name;
const ensureIdentity = (display: string) => {
  const tag = Math.random().toString(36).slice(2, 6);
  return `${display}#${tag}`;
};

export default function ChatWindow({ rooms }: Props) {
  const supabase = createClient();
  const [username, setUsername] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("lc_identity");
    return stored || null;
  });
  const [displayName, setDisplayName] = useState<string>(() => (typeof window !== "undefined" ? localStorage.getItem("lc_display") || "" : ""));
  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(rooms[0] || null);
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [dmConvos, setDmConvos] = useState<{ username: string; lastMessage: string; time: string }[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [offlineRecent, setOfflineRecent] = useState<string[]>([]);
  const [lastSeen, setLastSeen] = useState<Record<string, number>>({});
  const [sidebarTab, setSidebarTab] = useState<"rooms" | "messages" | "users">("rooms");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dmUnread, setDmUnread] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const presenceRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const initialScrollDone = useRef(false);

  const playNotification = useCallback(async () => {
    if (typeof window === "undefined") return;
    const ctx = audioCtxRef.current || new AudioContext();
    if (ctx.state === "suspended") await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + 0.12);
    audioCtxRef.current = ctx;
  }, []);

  const getChannelName = () => {
    if (activeRoom) return `room-${activeRoom.id}`;
    if (activeDM && username) {
      const participants = [username, activeDM].sort().join("-");
      return `dm-${participants}`;
    }
    return "chat-default";
  };

  useEffect(() => { setHydrated(true); }, []);

  // Load username from localStorage (fallback if not set by initializer)
  useEffect(() => {
    if (!username && typeof window !== "undefined") {
      const storedId = localStorage.getItem("lc_identity");
      const storedDisplay = localStorage.getItem("lc_display") || "";
      if (storedId) setUsername(storedId);
      if (storedDisplay) setDisplayName(storedDisplay);
    }
  }, [username]);

  const handleSetUsername = (name: string) => {
    const trimmed = name.trim();
    const identity = ensureIdentity(trimmed);
    localStorage.setItem("lc_identity", identity);
    localStorage.setItem("lc_display", trimmed);
    setDisplayName(trimmed);
    setUsername(identity);
  };

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!activeRoom && !activeDM) return;
    let query = supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(100);
    if (activeDM && username) {
      query = query.or(`and(sender_username.eq.${username},receiver_username.eq.${activeDM}),and(sender_username.eq.${activeDM},receiver_username.eq.${username})`);
    } else if (activeRoom) {
      query = query.eq("room_id", activeRoom.id).is("receiver_username", null);
    }
    const { data } = await query;
    if (data) setMessages(data);
    // Opening a DM clears its unread count
    if (activeDM) {
      setDmUnread(prev => ({ ...prev, [activeDM]: 0 }));
    }
  }, [activeRoom, activeDM, username]);

  const fetchDmConvos = useCallback(async () => {
    if (!username) return;
    const { data } = await supabase
      .from("messages")
      .select("sender_username,receiver_username,content,created_at")
      .not("receiver_username", "is", null)
      .or(`sender_username.eq.${username},receiver_username.eq.${username}`)
      .order("created_at", { ascending: false });
    if (data) {
      const latest: Record<string, { lastMessage: string; time: string }> = {};
      data.forEach(m => {
        const other = m.sender_username === username ? m.receiver_username : m.sender_username;
        if (!other || latest[other]) return;
        latest[other] = { lastMessage: m.content, time: m.created_at };
      });
      const list = Object.entries(latest)
        .map(([user, info]) => ({ username: user, lastMessage: info.lastMessage, time: info.time }))
        .sort((a, b) => b.time.localeCompare(a.time));
      setDmConvos(list);
    }
  }, [supabase, username]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { fetchDmConvos(); }, [fetchDmConvos]);

  // Global presence (tracks across rooms/DMs)
  useEffect(() => {
    if (!username) return;
    if (presenceRef.current) supabase.removeChannel(presenceRef.current);
    const presenceChannel = supabase.channel("presence-global", { config: { presence: { key: username } } });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState<{ username: string }>();
        const users = Object.values(state).flat().map((u: { username: string }) => u.username);
        setOnlineUsers([...new Set(users)]);
        setLastSeen(prev => {
          const now = Date.now();
          const updated = { ...prev };
          users.forEach(u => { updated[u] = now; });
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await presenceChannel.track({ username });
      });
    presenceRef.current = presenceChannel;
    return () => { supabase.removeChannel(presenceChannel); };
  }, [username]);

  useEffect(() => {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    setOfflineRecent(Object.entries(lastSeen)
      .filter(([u, t]) => !onlineUsers.includes(u) && now - t <= tenMinutes)
      .map(([u]) => u));
  }, [onlineUsers, lastSeen]);

  // Realtime subscription
  useEffect(() => {
    if (channelRef.current) { supabase.removeChannel(channelRef.current); }
    const channelName = getChannelName();
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        const isRelevant = activeDM
          ? (msg.receiver_username === activeDM && msg.sender_username === username) ||
            (msg.receiver_username === username && msg.sender_username === activeDM)
          : msg.room_id === activeRoom?.id && !msg.receiver_username;

        const isIncoming = msg.sender_username !== username;

        // If it's a DM to me, add convo and bump unread if not active
        if (msg.receiver_username === username) {
          setDmConvos(prev => {
            const exists = prev.find(d => d.username === msg.sender_username);
            if (exists) {
              return prev.map(d => d.username === msg.sender_username ? { ...d, lastMessage: msg.content, time: msg.created_at } : d);
            }
            return [{ username: msg.sender_username, lastMessage: msg.content, time: msg.created_at }, ...prev];
          });
          if (msg.sender_username !== activeDM) {
            setDmUnread(prev => ({ ...prev, [msg.sender_username]: (prev[msg.sender_username] || 0) + 1 }));
          }
          if (isIncoming) playNotification();
        }

        if (isRelevant) {
          setMessages(prev => [...prev, msg]);
          if (isIncoming && !activeDM) {
            playNotification();
          }
        }
      })
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [activeRoom, activeDM, username, playNotification]);

  // Presence
  useEffect(() => {
    if (!username || !activeRoom) return;
    const presenceChannel = supabase.channel(`presence-${activeRoom.id}`, { config: { presence: { key: username } } });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState<{ username: string }>();
        const users = Object.values(state).flat().map((u: { username: string }) => u.username);
        setOnlineUsers([...new Set(users)]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await presenceChannel.track({ username });
      });
    return () => { supabase.removeChannel(presenceChannel); };
  }, [username, activeRoom]);

  // Auto-scroll
  useEffect(() => {
    if (!initialScrollDone.current) { initialScrollDone.current = true; return; }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !username || sending) return;
    setSending(true);
    const payload: Record<string, string | null> = {
      sender_username: username,
      content: input.trim(),
      room_id: activeDM ? null : (activeRoom?.id ?? null),
      receiver_username: activeDM ?? null,
    };
    await supabase.from("messages").insert(payload);
    setInput("");
    setSending(false);

    // Update DM list
    if (activeDM) {
      setDmConvos(prev => {
        const exists = prev.find(d => d.username === activeDM);
        if (exists) return prev.map(d => d.username === activeDM ? { ...d, lastMessage: input.trim(), time: new Date().toISOString() } : d);
        return [{ username: activeDM, lastMessage: input.trim(), time: new Date().toISOString() }, ...prev];
      });
    }
  };

  const handleStartDM = (u: string) => {
    setActiveDM(u); setActiveRoom(null);
    setSidebarTab("messages"); setSidebarOpen(false);
    setDmUnread(prev => ({ ...prev, [u]: 0 }));
    if (!dmConvos.find(d => d.username === u)) {
      setDmConvos(prev => [{ username: u, lastMessage: "", time: new Date().toISOString() }, ...prev]);
    }
  };

  const chatTitle = activeDM ? `DM: @${formatName(activeDM)}` : (activeRoom ? `#${activeRoom.name}` : "Chat");
  const chatSubtitle = activeDM ? "Private message" : (activeRoom?.description || "");

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", background: "var(--bg)", position: "relative" }}>
      {hydrated && !username && <UsernameModal onSubmit={handleSetUsername} />}

      {/* Mobile sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: "none", position: "absolute", top: 12, left: 12, zIndex: 20, background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "0.5rem", cursor: "pointer" }} className="sidebar-toggle">
        ☰
      </button>

      {/* Sidebar */}
      <div style={{ position: "relative" }} className={sidebarOpen ? "sidebar-open" : ""}>
        <Sidebar
          rooms={rooms} activeRoom={activeRoom} onRoomSelect={(r) => { setActiveRoom(r); setActiveDM(null); setSidebarOpen(false); }}
          dmConvos={dmConvos} activeDM={activeDM} onDMSelect={(u) => { setActiveDM(u); setActiveRoom(null); setSidebarOpen(false); setDmUnread(prev => ({ ...prev, [u]: 0 })); }}
          onlineUsers={onlineUsers} offlineRecent={offlineRecent} currentUser={username || ""} onStartDM={handleStartDM}
          tab={sidebarTab} onTabChange={setSidebarTab}
          dmUnread={dmUnread}
        />
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", background: "white", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{chatTitle}</h2>
            {chatSubtitle && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{chatSubtitle}</p>}
          </div>
          {username && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="online-dot" />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>@{formatName(username)}</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", background: "white" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-light)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem", color: "var(--primary)" }}><IconInfo /></div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No messages yet</p>
              <p style={{ fontSize: "0.85rem" }}>Be the first to say hello!</p>
            </div>
          )}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} currentUser={username || ""} displayNameFormatter={formatName} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "0.875rem 1.25rem", background: "white", borderTop: "1px solid var(--border)" }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", gap: "0.625rem" }}>
            <input
              className="input"
              style={{ flex: 1 }}
              placeholder={username ? `Message ${chatTitle}...` : "Enter a username to start chatting..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!username || sending}
              maxLength={500}
            />
            <button type="submit" className="btn-primary" disabled={!username || !input.trim() || sending} style={{ padding: "0.625rem 1.25rem", flexShrink: 0 }}>
              {sending ? "..." : "Send ✓"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          aside { position: absolute !important; left: -260px; top: 0; z-index: 15; height: 100%; transition: left 0.25s ease; box-shadow: var(--shadow-lg); }
          .sidebar-open aside { left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
