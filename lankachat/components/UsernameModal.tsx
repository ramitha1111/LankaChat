"use client";
import { useState } from "react";

const IconChat = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

interface Props {
  onSubmit: (username: string) => void;
}

export default function UsernameModal({ onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError("Please enter a username"); return; }
    if (trimmed.length < 2) { setError("Username must be at least 2 characters"); return; }
    if (trimmed.length > 20) { setError("Username must be 20 characters or less"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError("Only letters, numbers and underscores allowed"); return; }
    onSubmit(trimmed);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem",
    }}>
      <div className="card animate-fade" style={{ width: "100%", maxWidth: 420, padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #2563EB, #06B6D4)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1rem", color: "white" }}><IconChat /></div>
          <h2 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "0.5rem" }}>Welcome to LankaChat</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Choose a username to start chatting. No account needed!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.5rem", color: "var(--text)" }}>Your Username</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Kasun123"
              value={value}
              onChange={e => { setValue(e.target.value); setError(""); }}
              maxLength={20}
            />
            {error && <p style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{error}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
            Enter Chat
          </button>
        </form>
        <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.78rem", marginTop: "1rem" }}>
          Letters, numbers and underscores only · Max 20 characters
        </p>
      </div>
    </div>
  );
}
