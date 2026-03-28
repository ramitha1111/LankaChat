import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin � LankaChat" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <nav style={{ background: "linear-gradient(135deg, #0F172A, #1E3A5F)", color: "white", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #2563EB, #06B6D4)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem" }}>LC</div>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Admin Panel</span>
            </div>
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem" }}>Dashboard</Link>
            <Link href="/admin/rooms" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem" }}>Rooms</Link>
            <Link href="/admin/blog" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem" }}>Blog</Link>
            <Link href="/admin/contacts" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.85rem" }}>Contacts</Link>
          </div>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem" }}>Back to Site</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {children}
      </div>
    </div>
  );
}
