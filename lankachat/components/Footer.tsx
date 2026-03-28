"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer style={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
      color: "white",
      padding: "3rem 1.5rem 1.5rem",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #2563EB, #06B6D4)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>LC</div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>LankaChat</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Sri Lanka''s free real-time chat platform. Connect instantly - no account needed.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "#E2E8F0" }}>Navigation</h4>
            {[["Home","/"],["Chat","/chat"],["Blog","/blog"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={h} href={h} style={{ display: "block", color: hoveredLink === h ? "#60A5FA" : "#94A3B8", textDecoration: "none", fontSize: "0.85rem", marginBottom: "0.4rem", transition: "color 0.2s" }}
                onMouseEnter={() => setHoveredLink(h)}
                onMouseLeave={() => setHoveredLink(null)}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "#E2E8F0" }}>Quick Chat</h4>
            <Link href="/chat" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "linear-gradient(135deg, #2563EB, #06B6D4)",
              color: "white", textDecoration: "none",
              padding: "0.625rem 1.25rem", borderRadius: 8,
              fontWeight: 600, fontSize: "0.875rem",
            }}>💬 Join Chat Now</Link>
            <p style={{ color: "#64748B", fontSize: "0.78rem", marginTop: "0.75rem" }}>No sign up required</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1E293B", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ color: "#475569", fontSize: "0.8rem" }}>© {new Date().getFullYear()} LankaChat. Made with ❤️ for Sri Lanka 🇱🇰</p>
          <p style={{ color: "#475569", fontSize: "0.8rem" }}>Free · Fast · Private</p>
        </div>
      </div>
    </footer>
  );
}
