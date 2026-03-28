import { createAdminClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5H9v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
  </svg>
);

const IconNote = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);

const IconChat = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const IconMail = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = await createAdminClient();
  const [{ count: roomCount }, { count: postCount }, { count: msgCount }, { count: contactCount }] = await Promise.all([
    admin.from("rooms").select("*", { count: "exact", head: true }),
    admin.from("posts").select("*", { count: "exact", head: true }),
    admin.from("messages").select("*", { count: "exact", head: true }),
    admin.from("contacts").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Chat Rooms", value: roomCount || 0, icon: <IconHome />, href: "/admin/rooms", color: "#2563EB" },
    { label: "Blog Posts", value: postCount || 0, icon: <IconNote />, href: "/admin/blog", color: "#7C3AED" },
    { label: "Messages Today", value: msgCount || 0, icon: <IconChat />, href: null, color: "#059669" },
    { label: "Contact Requests", value: contactCount || 0, icon: <IconMail />, href: null, color: "#D97706" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "2rem" }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)" }}>Welcome back, {user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: s.color, marginTop: "0.25rem" }}>{s.value}</p>
              </div>
              <span style={{ fontSize: "1.75rem", color: s.color }}>{s.icon}</span>
            </div>
            {s.href && <Link href={s.href} style={{ fontSize: "0.8rem", color: s.color, textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: "0.75rem" }}>Manage →</Link>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><IconHome /> Manage Rooms</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>Create, edit, or delete public chat rooms visible to all users.</p>
          <Link href="/admin/rooms" className="btn-primary" style={{ textDecoration: "none" }}>Go to Rooms</Link>
        </div>
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><IconNote /> Manage Blog</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>Write new posts, edit existing ones, publish or unpublish content.</p>
          <Link href="/admin/blog" className="btn-primary" style={{ textDecoration: "none" }}>Go to Blog</Link>
        </div>
      </div>
    </div>
  );
}
