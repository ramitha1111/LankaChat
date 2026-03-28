"use client";
import { useState, useEffect, useCallback } from "react";

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5H9v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
  </svg>
);

const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

interface Room { id: string; name: string; description: string | null; created_at: string; }

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRooms = useCallback(async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("Room created!");
      setForm({ name: "", description: "" });
      fetchRooms();
    } else {
      const d = await res.json();
      setError(d.error || "Failed");
    }
    setSaving(false);
  };

  const deleteRoom = async (id: string, name: string) => {
    if (!confirm(`Delete room "${name}"? This will delete all messages in it.`)) return;
    const res = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchRooms();
  };

  return (
    <div>
      <h1 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><IconHome /> Chat Rooms</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        {/* Create form */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1.5rem" }}>Create New Room</h2>
          <form onSubmit={createRoom} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Room Name *</label>
              <input className="input" placeholder="e.g. General" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Description</label>
              <input className="input" placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><IconError /> {error}</p>}
            {success && <p style={{ color: "var(--success)", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><IconSuccess /> {success}</p>}
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Creating..." : "Create Room"}</button>
          </form>
        </div>

        {/* Room list */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1.5rem" }}>All Rooms ({rooms.length})</h2>
          {loading ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {rooms.map(room => (
                <div key={room.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem", background: "var(--bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>#{room.name}</p>
                    {room.description && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{room.description}</p>}
                  </div>
                  <button onClick={() => deleteRoom(room.id, room.name)} style={{ background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "0.35rem 0.75rem", color: "var(--error)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
