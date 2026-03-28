"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #2563EB, #06B6D4)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: "1rem",
          }}>LC</div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)" }}>
            Lanka<span style={{ color: "var(--accent)" }}>Chat</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: pathname === l.href ? "var(--primary)" : "var(--text-muted)",
              background: pathname === l.href ? "var(--primary-50)" : "transparent",
              transition: "all 0.2s",
            }}>{l.label}</Link>
          ))}
          <Link href="/chat" className="btn-primary" style={{ marginLeft: "0.5rem", textDecoration: "none" }}>
            <IconChat /> Start Chatting
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "none" }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          <div style={{ width: 22, height: 2, background: "var(--text)", marginBottom: 5, borderRadius: 2, transition: "all 0.2s",
            transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "var(--text)", marginBottom: 5, borderRadius: 2, opacity: open ? 0 : 1 }} />
          <div style={{ width: 22, height: 2, background: "var(--text)", borderRadius: 2, transition: "all 0.2s",
            transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "white",
          borderTop: "1px solid var(--border)",
          padding: "1rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontWeight: 500,
              color: pathname === l.href ? "var(--primary)" : "var(--text)",
              background: pathname === l.href ? "var(--primary-50)" : "transparent",
            }}>{l.label}</Link>
          ))}
          <Link href="/chat" onClick={() => setOpen(false)} className="btn-primary" style={{ textDecoration: "none", justifyContent: "center" }}>
            <IconChat /> Start Chatting
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
