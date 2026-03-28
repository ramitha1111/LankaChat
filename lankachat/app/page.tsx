import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import BlogCard from "@/components/BlogCard";

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

const IconDoor = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M10 12h.01" />
  </svg>
);

const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

export default async function HomePage() {
  const supabase = await createAdminClient();
  const { data: posts } = await supabase.from("posts").select("id,title,slug,excerpt,cover_image_url,created_at").eq("published", true).order("created_at", { ascending: false }).limit(3);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1D4ED8 100%)",
        padding: "8rem 1.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 400, height: 400, background: "rgba(96,165,250,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: 300, height: 300, background: "rgba(6,182,212,0.08)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "stretch", paddingBottom: "0" }}>
          <div className="animate-fade">
            <div className="badge badge-blue" style={{ marginBottom: "1.5rem", background: "rgba(96,165,250,0.15)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.3)" }}>
              Sri Lanka Free Chat Platform
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Chat Freely.<br />
              <span style={{ background: "linear-gradient(90deg, #60A5FA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                No Sign-Up.
              </span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#94A3B8", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 480 }}>
              Join public chat rooms or send private messages instantly. Just enter a username and start chatting — completely free.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/chat" className="btn-primary" style={{ textDecoration: "none", fontSize: "1rem", padding: "0.875rem 2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <IconArrowRight />
                Start Chatting Now
              </Link>
              <Link href="/blog" className="btn-secondary" style={{ textDecoration: "none", fontSize: "1rem", padding: "0.875rem 2rem", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <IconBook />
                Read Blog
              </Link>
            </div>
          </div>
          <div className="animate-fade" style={{ position: "relative", width: "100%", minHeight: 440, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 640, borderRadius: 0, overflow: "visible", background: "transparent", boxShadow: "none", border: "none" }}>
              <img
                src="https://res.cloudinary.com/dk3wijfuk/image/upload/v1774702024/hero-image_flw4wg.png"
                alt="Person using a laptop to chat"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--primary-50)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>How It Works</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>Three steps to start chatting</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "1", icon: <IconUser />, title: "Pick a Username", desc: "Choose any username – no email, no password, no waiting." },
              { step: "2", icon: <IconDoor />, title: "Join a Room", desc: "Browse public rooms or start a private DM with anyone." },
              { step: "3", icon: <IconChat />, title: "Chat!", desc: "Real-time messaging – messages appear instantly for everyone." },
            ].map(item => (
              <div key={item.step} className="card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, var(--primary), var(--accent))", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 1rem", color: "white" }}>{item.icon}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Step {item.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog posts */}
      {posts && posts.length > 0 && (
        <section style={{ padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Latest from Our Blog</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>Tips, updates and stories</p>
              </div>
              <Link href="/blog" className="btn-secondary" style={{ textDecoration: "none" }}>View all →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {posts.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section style={{ padding: "4rem 1.5rem", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Ready to Chat?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "2rem", fontSize: "1.05rem" }}>No account needed. Just pick a name and dive in.</p>
          <Link href="/chat" style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "white", color: "var(--primary)", padding: "0.875rem 2.5rem",
            borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "1rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "transform 0.2s",
          }}><IconArrowRight /> Enter LankaChat</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
